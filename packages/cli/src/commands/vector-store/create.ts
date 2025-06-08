import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  addGlobalOptions,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { z } from 'zod';

const CreateVectorStoreSchema = GlobalOptionsSchema.extend({
  name: z.string().min(1, { message: '"name" is required' }),
  description: z.string().optional(),
  expiresAfter: z.coerce
    .number({ message: '"expires-after" must be a number' })
    .int({ message: '"expires-after" must be an integer' })
    .positive({ message: '"expires-after" must be positive' })
    .optional(),
  metadata: z.string().optional(),
});

interface CreateOptions extends GlobalOptions {
  description?: string;
  expiresAfter?: number;
  metadata?: string;
}

export function createCreateCommand(): Command {
  const command = addGlobalOptions(
    new Command('create')
      .description('Create a new vector store')
      .argument('<name>', 'Name of the vector store')
      .option('--description <desc>', 'Description of the vector store')
      .option('--expires-after <days>', 'Expire after number of days')
      .option('--metadata <json>', 'Additional metadata as JSON string'),
  );

  command.action(async (name: string, options: CreateOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const client = createClient(mergedOptions);

      const parsedOptions = parseOptions(CreateVectorStoreSchema, { ...mergedOptions, name });

      let metadata: Record<string, unknown> | undefined;
      if (parsedOptions.metadata) {
        try {
          metadata = JSON.parse(parsedOptions.metadata);
        } catch (error) {
          console.error(chalk.red('Error:'), 'Invalid JSON in metadata option');
          process.exit(1);
        }
      }

      const vectorStore = await client.vectorStores.create({
        name: parsedOptions.name,
        description: parsedOptions.description,
        expires_after:
          parsedOptions.expiresAfter ?
            {
              anchor: 'last_active_at',
              days: parsedOptions.expiresAfter,
            }
          : undefined,
        metadata,
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
        parsedOptions.format,
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
