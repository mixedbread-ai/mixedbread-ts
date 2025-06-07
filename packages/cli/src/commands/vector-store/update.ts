import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { z } from 'zod';

const UpdateVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  name: z.string().optional(),
  description: z.string().optional(),
  metadata: z.string().optional(),
});

interface UpdateOptions extends GlobalOptions {
  name?: string;
  description?: string;
  metadata?: string;
}

export function createUpdateCommand(): Command {
  const command = new Command('update')
    .description('Update a vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .option('--name <name>', 'New name for the vector store')
    .option('--description <desc>', 'New description for the vector store')
    .option('--metadata <json>', 'New metadata as JSON string (replaces existing)');

  command.action(async (nameOrId: string, options: UpdateOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);

      const parsedOptions = parseOptions(UpdateVectorStoreSchema, { ...mergedOptions, nameOrId });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      // Parse metadata if provided
      let metadata: Record<string, unknown> | undefined;
      if (parsedOptions.metadata) {
        try {
          metadata = JSON.parse(parsedOptions.metadata);
        } catch (error) {
          console.error(chalk.red('Error:'), 'Invalid JSON in metadata option');
          process.exit(1);
        }
      }

      // Build update payload
      const updateData: Record<string, unknown> = {};
      if (parsedOptions.name) updateData.name = parsedOptions.name;
      if (parsedOptions.description !== undefined) updateData.description = parsedOptions.description;
      if (metadata !== undefined) updateData.metadata = metadata;

      if (Object.keys(updateData).length === 0) {
        console.error(
          chalk.red('Error:'),
          'No update fields provided. Use --name, --description, or --metadata',
        );
        process.exit(1);
      }

      const updatedVectorStore = await client.vectorStores.update(vectorStore.id, updateData);

      console.log(chalk.green('✓'), `Vector store "${vectorStore.name}" updated successfully`);

      formatOutput(updatedVectorStore, parsedOptions.format);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to update vector store');
      }
      process.exit(1);
    }
  });

  return command;
}
