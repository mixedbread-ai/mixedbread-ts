import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import { readFileSync, statSync } from 'fs';
import { relative, basename } from 'path';
import { lookup } from 'mime-types';
import ora from 'ora';
import { z } from 'zod';
import { createClient } from '../../utils/client';
import { formatBytes, formatCountWithSuffix } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  addGlobalOptions,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { loadConfig } from '../../utils/config';
import { validateMetadata } from '../../utils/metadata';
import { Mixedbread } from '@mixedbread/sdk';
import { uploadFromManifest } from '../../utils/manifest';

const UploadVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  patterns: z.array(z.string()).optional(),
  strategy: z
    .enum(['fast', 'high_quality'], { message: '"strategy" must be either "fast" or "high_quality"' })
    .optional(),
  contextualization: z.boolean({ message: '"contextualization" must be a boolean' }).optional(),
  metadata: z.string().optional(),
  dryRun: z.boolean().optional(),
  parallel: z.coerce
    .number({ message: '"parallel" must be a number' })
    .int({ message: '"parallel" must be an integer' })
    .positive({ message: '"parallel" must be positive' })
    .max(20, { message: '"parallel" must be less than or equal to 20' })
    .optional(),
  unique: z.boolean().optional(),
  manifest: z.string().optional(),
});

export interface UploadOptions extends GlobalOptions {
  strategy?: 'fast' | 'high_quality';
  contextualization?: boolean;
  metadata?: string;
  dryRun?: boolean;
  parallel?: number;
  unique?: boolean;
  manifest?: string;
}

export function createUploadCommand(): Command {
  const command = addGlobalOptions(
    new Command('upload')
      .description('Upload files to a vector store')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('[patterns...]', 'File patterns to upload (e.g., "*.md", "docs/**/*.pdf")')
      .option('--strategy <strategy>', 'Processing strategy', 'fast')
      .option('--contextualization', 'Enable context preservation', false)
      .option('--metadata <json>', 'Additional metadata as JSON string')
      .option('--dry-run', 'Preview what would be uploaded', false)
      .option('--parallel <n>', 'Number of concurrent uploads')
      .option('--unique', 'Update existing files instead of creating duplicates', false)
      .option('--manifest <file>', 'Upload using manifest file'),
  );

  command.action(async (nameOrId: string, patterns: string[], options: UploadOptions) => {
    const spinner = ora('Initializing upload...').start();

    try {
      const mergedOptions = mergeCommandOptions(command, options);

      const parsedOptions = parseOptions(UploadVectorStoreSchema, { ...mergedOptions, nameOrId, patterns });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);
      const config = loadConfig();

      spinner.succeed('Upload initialized');

      // Handle manifest file upload
      if (parsedOptions.manifest) {
        return await uploadFromManifest(client, vectorStore.id, parsedOptions.manifest, parsedOptions);
      }

      if (!parsedOptions.patterns || parsedOptions.patterns.length === 0) {
        console.error(
          chalk.red('Error:'),
          'No file patterns provided. Use --manifest for manifest-based uploads.',
        );
        process.exit(1);
      }

      // Get configuration values with precedence: command-line > config defaults > built-in defaults
      const strategy = parsedOptions.strategy ?? config.defaults?.upload?.strategy ?? 'fast';
      const contextualization =
        parsedOptions.contextualization ?? config.defaults?.upload?.contextualization ?? false;
      const parallel = parsedOptions.parallel ?? config.defaults?.upload?.parallel ?? 5;

      const metadata = validateMetadata(parsedOptions.metadata);

      // Collect all files matching patterns
      const files: string[] = [];
      for (const pattern of parsedOptions.patterns) {
        const matches = await glob(pattern, {
          nodir: true,
          absolute: false,
        });
        files.push(...matches);
      }
      // Remove duplicates
      const uniqueFiles = [...new Set(files)];

      if (parsedOptions.patterns) {
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

        console.log(
          `Found ${formatCountWithSuffix(uniqueFiles.length, 'file')} matching the ${
            patterns.length > 1 ? 'patterns' : 'pattern'
          } (${formatBytes(totalSize)})`,
        );
      }

      if (parsedOptions.dryRun) {
        console.log(chalk.blue('Dry run - files that would be uploaded:'));
        uniqueFiles.forEach((file) => {
          const stats = statSync(file);
          console.log(`  ${file} (${formatBytes(stats.size)})`);
        });
        return;
      }

      // Handle --unique flag: check for existing files
      let existingFiles: Map<string, string> = new Map();
      if (parsedOptions.unique) {
        const spinner = ora('Checking for existing files...').start();
        try {
          const filesResponse = await client.vectorStores.files.list(vectorStore.id, { limit: 1000 });
          existingFiles = new Map(
            filesResponse.data
              .filter((f: any) => files.includes(f.metadata?.file_path))
              .map((f: any) => [f.metadata.file_path as string, f.id]),
          );
          spinner.succeed(`Found ${formatCountWithSuffix(existingFiles.size, 'existing file')}`);
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
        additionalMetadata: metadata,
        unique: parsedOptions.unique || false,
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
  client: Mixedbread,
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

  console.log(`\nUploading ${formatCountWithSuffix(files.length, 'file')} to vector store...`);

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
          await client.vectorStores.files.delete(existingFileId, { vector_store_identifier: vectorStoreId });
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
        const fileName = basename(filePath);
        const mimeType = lookup(filePath) || 'application/octet-stream';
        const file = new File([fileContent], fileName, { type: mimeType });

        await client.vectorStores.files.upload(vectorStoreId, file, {
          metadata: fileMetadata,
          experimental: {
            parsing_strategy: strategy as 'fast' | 'high_quality',
            contextualization,
          },
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
