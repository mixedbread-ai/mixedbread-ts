import { parse } from 'yaml';
import { z } from 'zod';
import { Mixedbread } from '@mixedbread/sdk';
import { readFileSync, statSync } from 'fs';
import { glob } from 'glob';
import { relative, basename } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { formatBytes, formatCountWithSuffix } from './output';
import { lookup } from 'mime-types';
import { UploadOptions } from '../commands/vector-store/upload';
import { loadConfig } from './config';
import { validateMetadata } from './metadata';

// Manifest file schema
const ManifestFileEntrySchema = z.object({
  path: z.string().min(1, { message: 'File path is required' }),
  strategy: z.enum(['fast', 'high_quality']).optional(),
  contextualization: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const ManifestSchema = z.object({
  version: z.string().optional().default('1.0'),
  defaults: z
    .object({
      strategy: z.enum(['fast', 'high_quality']).optional(),
      contextualization: z.boolean().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  files: z.array(ManifestFileEntrySchema).min(1, { message: 'At least one file entry is required' }),
});

type ManifestFile = z.infer<typeof ManifestSchema>;

interface ResolvedFile {
  path: string;
  strategy: string;
  contextualization: boolean;
  metadata: Record<string, unknown>;
}

export async function uploadFromManifest(
  client: Mixedbread,
  vectorStoreId: string,
  manifestPath: string,
  options: UploadOptions,
) {
  console.log(chalk.bold(`Loading manifest from: ${manifestPath}`));

  try {
    const config = loadConfig();
    // Read and parse manifest file
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    let manifestData: ManifestFile | null = null;

    try {
      // Try JSON first
      manifestData = JSON.parse(manifestContent);
    } catch {
      try {
        // Try YAML if JSON fails
        manifestData = parse(manifestContent);
      } catch {
        throw new Error('Manifest file must be valid JSON or YAML');
      }
    }

    // Validate manifest structure
    const manifest = ManifestSchema.parse(manifestData);
    console.log(chalk.gray(`Manifest version: ${manifest.version}`));
    console.log(
      chalk.gray(`Found ${manifest.files.length} file ${manifest.files.length === 1 ? 'entry' : 'entries'}`),
    );

    // Resolve all files from manifest entries
    const resolvedFiles: ResolvedFile[] = [];

    const defaults = manifest.defaults || {};
    const optionsMetadata = validateMetadata(options.metadata);

    for (const entry of manifest.files) {
      console.log(chalk.gray(`Resolving: ${entry.path}`));

      // Resolve glob patterns
      const matchedFiles = await glob(entry.path, {
        nodir: true,
        absolute: false,
      });

      if (matchedFiles.length === 0) {
        console.warn(chalk.yellow(`Warning: No files found for pattern: ${entry.path}`));
        continue;
      }

      // Add each matched file with its configuration
      for (const filePath of matchedFiles) {
        // Precedence for file-specific: command-line > entry-specific > config defaults > manifest defaults > built-in defaults
        const fileStrategy =
          options.strategy ??
          entry.strategy ??
          config.defaults.upload.strategy ??
          defaults.strategy ??
          'fast';
        const fileContextualization =
          options.contextualization ??
          entry.contextualization ??
          config.defaults.upload.contextualization ??
          defaults.contextualization ??
          false;

        // Merge metadata: command-line (highest) > entry-specific > manifest defaults
        const fileMetadata = {
          ...defaults.metadata,
          ...entry.metadata,
          ...optionsMetadata,
        };

        resolvedFiles.push({
          path: filePath,
          strategy: fileStrategy,
          contextualization: fileContextualization,
          metadata: fileMetadata,
        });
      }
    }

    if (resolvedFiles.length === 0) {
      console.log(chalk.yellow('No files found matching manifest patterns.'));
      return;
    }

    // Remove duplicates (same file with potentially different configs - last wins)
    const uniqueFiles = new Map<string, ResolvedFile>();
    for (const file of resolvedFiles) {
      uniqueFiles.set(file.path, file);
    }

    const finalFiles = Array.from(uniqueFiles.values());
    console.log(chalk.green('✓'), `Resolved ${formatCountWithSuffix(finalFiles.length, 'file')} for upload`);

    // Calculate total size
    const totalSize = finalFiles.reduce((sum, file) => {
      try {
        return sum + statSync(file.path).size;
      } catch {
        return sum;
      }
    }, 0);

    console.log(chalk.gray(`Total size: ${formatBytes(totalSize)}`));

    // Dry run preview
    if (options.dryRun) {
      console.log(chalk.blue('\nDry run - files that would be uploaded:'));
      finalFiles.forEach((file) => {
        try {
          const stats = statSync(file.path);
          console.log(`  ${file.path} (${formatBytes(stats.size)})`);
          console.log(`    Strategy: ${file.strategy}, Contextualization: ${file.contextualization}`);
          if (Object.keys(file.metadata).length > 0) {
            console.log(`    Metadata: ${JSON.stringify(file.metadata)}`);
          }
        } catch (error) {
          console.log(`  ${file.path} (${chalk.red('Error: File not found')})`);
        }
      });
      return;
    }

    // Handle --unique flag: check for existing files
    let existingFiles: Map<string, string> = new Map();
    if (options.unique) {
      const spinner = ora('Checking for existing files...').start();
      try {
        const filesResponse = await client.vectorStores.files.list(vectorStoreId, { limit: 1000 });
        existingFiles = new Map(
          filesResponse.data
            .filter((f) =>
              finalFiles.some((file) => {
                return (
                  typeof f.metadata === 'object' &&
                  f.metadata &&
                  'file_path' in f.metadata &&
                  f.metadata.file_path === relative(process.cwd(), file.path)
                );
              }),
            )
            .map((f) => [(f.metadata as { file_path: string }).file_path, f.id]),
        );
        spinner.succeed(`Found ${formatCountWithSuffix(existingFiles.size, 'existing file')}`);
      } catch (error) {
        spinner.fail('Failed to check existing files');
        throw error;
      }
    }

    // Upload files
    await uploadManifestFiles(client, vectorStoreId, finalFiles, {
      unique: options.unique || false,
      existingFiles,
      parallel: options.parallel ?? config.defaults.upload.parallel ?? 5,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(chalk.red('Error:'), 'Invalid manifest file format:');
      error.errors.forEach((err) => {
        console.error(chalk.red(`  - ${err.path.join('.')}: ${err.message}`));
      });
    } else if (error instanceof Error) {
      console.error(chalk.red('Error:'), error.message);
    } else {
      console.error(chalk.red('Error:'), 'Failed to process manifest file');
    }
    process.exit(1);
  }
}

async function uploadManifestFiles(
  client: Mixedbread,
  vectorStoreId: string,
  files: Array<{
    path: string;
    strategy: string;
    contextualization: boolean;
    metadata: Record<string, unknown>;
  }>,
  options: {
    unique: boolean;
    existingFiles: Map<string, string>;
    parallel: number;
  },
) {
  const { unique, existingFiles, parallel } = options;

  console.log(`\nUploading ${formatCountWithSuffix(files.length, 'file')} from manifest...`);

  const results = {
    uploaded: 0,
    updated: 0,
    failed: 0,
    errors: [] as string[],
  };

  const batch = Math.ceil(files.length / parallel);

  console.log(
    chalk.gray(`Processing batch ${batch} (${formatCountWithSuffix(parallel, 'file')} per batch)...`),
  );

  // Process files in batches
  for (let i = 0; i < files.length; i += parallel) {
    const batch = files.slice(i, i + parallel);
    const promises = batch.map(async (file) => {
      const spinner = ora(`Uploading ${basename(file.path)}...`).start();

      try {
        // Delete existing file if using --unique
        const relativePath = relative(process.cwd(), file.path);
        if (unique && existingFiles.has(relativePath)) {
          const existingFileId = existingFiles.get(relativePath);
          await client.vectorStores.files.delete(existingFileId, { vector_store_identifier: vectorStoreId });
          results.updated++;
        } else {
          results.uploaded++;
        }

        // Prepare file metadata with manifest metadata
        const fileMetadata = {
          file_path: relativePath,
          uploaded_at: new Date().toISOString(),
          manifest_entry: true,
          ...file.metadata,
        };

        // Upload the file
        const fileContent = readFileSync(file.path);
        const fileName = basename(file.path);
        const mimeType = lookup(file.path) || 'application/octet-stream';
        const fileObj = new File([fileContent], fileName, { type: mimeType });

        await client.vectorStores.files.upload(vectorStoreId, fileObj, {
          metadata: fileMetadata,
          experimental: {
            parsing_strategy: file.strategy as 'fast' | 'high_quality',
            contextualization: file.contextualization,
          },
        });

        const stats = statSync(file.path);
        spinner.succeed(`${basename(file.path)} (${formatBytes(stats.size)})`);
      } catch (error) {
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`${file.path}: ${errorMsg}`);
        spinner.fail(`${basename(file.path)} - ${errorMsg}`);
      }
    });

    await Promise.all(promises);
  }

  // Summary
  console.log('\n' + chalk.bold('Manifest Upload Summary:'));
  if (results.uploaded > 0) {
    console.log(chalk.green(`✓ ${formatCountWithSuffix(results.uploaded, 'file')} uploaded successfully`));
  }
  if (results.updated > 0) {
    console.log(chalk.blue(`↻ ${formatCountWithSuffix(results.updated, 'file')} updated`));
  }
  if (results.failed > 0) {
    console.log(chalk.red(`✗ ${formatCountWithSuffix(results.failed, 'file')} failed`));
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((error) => console.log(chalk.red(`  ${error}`)));
    }
  }
}
