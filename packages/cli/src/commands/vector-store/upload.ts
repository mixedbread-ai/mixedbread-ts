import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import { readFileSync, statSync } from 'fs';
import { relative, basename } from 'path';
import ora from 'ora';
import { createClient } from '../../utils/client';
import { formatBytes } from '../../utils/output';
import { GlobalOptions, mergeCommandOptions } from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { loadConfig } from '../../utils/config';

interface UploadOptions extends GlobalOptions {
  strategy?: 'fast' | 'high_quality';
  contextualization?: boolean;
  metadata?: string;
  dryRun?: boolean;
  parallel?: number;
  unique?: boolean;
  manifest?: string;
}

export function createUploadCommand(): Command {
  const command = new Command('upload')
    .description('Upload files to a vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .argument('[patterns...]', 'File patterns to upload (e.g., "*.md", "docs/**/*.pdf")')
    .option('--strategy <strategy>', 'Processing strategy', 'fast')
    .option('--contextualization', 'Enable context preservation', false)
    .option('--metadata <json>', 'Additional metadata as JSON string')
    .option('--dry-run', 'Preview what would be uploaded', false)
    .option('--parallel <n>', 'Number of concurrent uploads', parseInt)
    .option('--unique', 'Update existing files instead of creating duplicates', false)
    .option('--manifest <file>', 'Upload using manifest file');

  command.action(async (nameOrId: string, patterns: string[], options: UploadOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const client = createClient(mergedOptions);
      const vectorStore = await resolveVectorStore(client, nameOrId);
      const config = loadConfig();

      // Handle manifest file upload
      if (mergedOptions.manifest) {
        return await uploadFromManifest(client, vectorStore.id, mergedOptions.manifest, mergedOptions);
      }

      if (!patterns || patterns.length === 0) {
        console.error(
          chalk.red('Error:'),
          'No file patterns provided. Use --manifest for manifest-based uploads.',
        );
        process.exit(1);
      }

      // Get default values from config
      const strategy = mergedOptions.strategy || config.defaults?.upload?.strategy || 'fast';
      const contextualization =
        mergedOptions.contextualization !== undefined ?
          mergedOptions.contextualization
        : config.defaults?.upload?.contextualization ?? false;
      const parallel = mergedOptions.parallel || config.defaults?.upload?.parallel || 5;

      // Parse additional metadata
      let additionalMetadata: Record<string, any> = {};
      if (mergedOptions.metadata) {
        try {
          additionalMetadata = JSON.parse(mergedOptions.metadata);
        } catch (error) {
          console.error(chalk.red('Error:'), 'Invalid JSON in metadata option');
          process.exit(1);
        }
      }

      // Collect all files matching patterns
      const files: string[] = [];
      for (const pattern of patterns) {
        const matches = await glob(pattern, {
          nodir: true,
          absolute: false,
        });
        files.push(...matches);
      }

      // Remove duplicates
      const uniqueFiles = [...new Set(files)];

      if (uniqueFiles.length === 0) {
        console.log(chalk.yellow('No files found matching the patterns.'));
        return;
      }

      // Calculate total size
      const totalSize = uniqueFiles.reduce((sum, file) => {
        try {
          return sum + statSync(file).size;
        } catch {
          return sum;
        }
      }, 0);

      console.log(`Found ${uniqueFiles.length} files (${formatBytes(totalSize)})`);

      if (mergedOptions.dryRun) {
        console.log(chalk.blue('Dry run - files that would be uploaded:'));
        uniqueFiles.forEach((file) => {
          const stats = statSync(file);
          console.log(`  ${file} (${formatBytes(stats.size)})`);
        });
        return;
      }

      // Handle --unique flag: check for existing files
      let existingFiles: Map<string, string> = new Map();
      if (mergedOptions.unique) {
        const spinner = ora('Checking for existing files...').start();
        try {
          const filesResponse = await client.vectorStores.files.list(vectorStore.id, { limit: 1000 });
          existingFiles = new Map(
            filesResponse.data
              .filter((f: any) => f.metadata?.file_path)
              .map((f: any) => [f.metadata.file_path as string, f.id]),
          );
          spinner.succeed(`Found ${existingFiles.size} existing files`);
        } catch (error) {
          spinner.fail('Failed to check existing files');
          throw error;
        }
      }

      // Upload files with progress tracking
      await uploadFiles(client, vectorStore.id, uniqueFiles, {
        strategy,
        contextualization,
        parallel,
        additionalMetadata,
        unique: mergedOptions.unique || false,
        existingFiles,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to upload files');
      }
      process.exit(1);
    }
  });

  return command;
}

async function uploadFiles(
  client: any,
  vectorStoreId: string,
  files: string[],
  options: {
    strategy: string;
    contextualization: boolean;
    parallel: number;
    additionalMetadata: Record<string, any>;
    unique: boolean;
    existingFiles: Map<string, string>;
  },
) {
  const { strategy, contextualization, parallel, additionalMetadata, unique, existingFiles } = options;

  console.log(`\nUploading ${files.length} files to vector store...`);

  const results = {
    uploaded: 0,
    updated: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Process files in batches
  for (let i = 0; i < files.length; i += parallel) {
    const batch = files.slice(i, i + parallel);
    const promises = batch.map(async (filePath) => {
      const spinner = ora(`Uploading ${basename(filePath)}...`).start();

      try {
        // Delete existing file if using --unique
        const relativePath = relative(process.cwd(), filePath);
        if (unique && existingFiles.has(relativePath)) {
          const existingFileId = existingFiles.get(relativePath)!;
          await client.vectorStores.files.del(vectorStoreId, existingFileId);
          results.updated++;
        } else {
          results.uploaded++;
        }

        // Prepare file metadata
        const fileMetadata = {
          file_path: relativePath,
          uploaded_at: new Date().toISOString(),
          ...(unique && { synced: true }),
          ...additionalMetadata,
        };

        // Upload the file
        const fileContent = readFileSync(filePath);
        const file = new File([fileContent], basename(filePath));

        await client.vectorStores.files.create(vectorStoreId, {
          file,
          metadata: fileMetadata,
          ...(strategy && { strategy }),
          ...(contextualization && { contextualization }),
        });

        const stats = statSync(filePath);
        spinner.succeed(`${basename(filePath)} (${formatBytes(stats.size)})`);
      } catch (error) {
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`${filePath}: ${errorMsg}`);
        spinner.fail(`${basename(filePath)} - ${errorMsg}`);
      }
    });

    await Promise.all(promises);
  }

  // Summary
  console.log('\n' + chalk.bold('Upload Summary:'));
  if (results.uploaded > 0) {
    console.log(chalk.green(`✓ ${results.uploaded} files uploaded successfully`));
  }
  if (results.updated > 0) {
    console.log(chalk.blue(`↻ ${results.updated} files updated`));
  }
  if (results.failed > 0) {
    console.log(chalk.red(`✗ ${results.failed} files failed`));
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((error) => console.log(chalk.red(`  ${error}`)));
    }
  }
}

async function uploadFromManifest(
  client: any,
  vectorStoreId: string,
  manifestPath: string,
  options: UploadOptions,
) {
  // TODO: Implement manifest-based upload
  console.error(chalk.red('Error:'), 'Manifest-based upload not yet implemented');
  process.exit(1);
}
