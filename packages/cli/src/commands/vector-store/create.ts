import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput } from '../../utils/output';
import { GlobalOptions, mergeCommandOptions } from '../../utils/global-options';

interface CreateOptions extends GlobalOptions {
  description?: string;
  expiresAfter?: number;
  metadata?: string;
}

export function createCreateCommand(): Command {
  const command = new Command('create')
    .description('Create a new vector store')
    .argument('<name>', 'Name of the vector store')
    .option('--description <desc>', 'Description of the vector store')
    .option('--expires-after <days>', 'Expire after number of days', parseInt)
    .option('--metadata <json>', 'Additional metadata as JSON string');

  command.action(async (name: string, options: CreateOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const client = createClient(mergedOptions);

      // Parse metadata if provided
      let metadata: Record<string, unknown> | undefined;
      if (mergedOptions.metadata) {
        try {
          metadata = JSON.parse(mergedOptions.metadata);
        } catch (error) {
          console.error(chalk.red('Error:'), 'Invalid JSON in metadata option');
          process.exit(1);
        }
      }

      const vectorStore = await client.vectorStores.create({
        name,
        description: mergedOptions.description,
        expires_after:
          mergedOptions.expiresAfter ?
            {
              anchor: 'last_active_at',
              days: mergedOptions.expiresAfter,
            }
          : undefined,
        metadata: metadata,
      });

      console.log(chalk.green('✓'), `Vector store "${name}" created successfully`);

      formatOutput(
        {
          id: vectorStore.id,
          name: vectorStore.name,
          description: vectorStore.description,
          expires_after: vectorStore.expires_after,
          metadata: vectorStore.metadata,
        },
        mergedOptions.format,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to create vector store');
      }
      process.exit(1);
    }
  });

  return command;
}
