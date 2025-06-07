import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput } from '../../utils/output';
import { GlobalOptions, mergeCommandOptions } from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';

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
      const client = createClient(mergedOptions);
      const vectorStore = await resolveVectorStore(client, nameOrId);

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

      // Build update payload
      const updateData: Record<string, unknown> = {};
      if (mergedOptions.name) updateData.name = mergedOptions.name;
      if (mergedOptions.description !== undefined) updateData.description = mergedOptions.description;
      if (metadata !== undefined) updateData.metadata = metadata;

      if (Object.keys(updateData).length === 0) {
        console.error(chalk.red('Error:'), 'No update fields provided. Use --name, --description, or --metadata');
        process.exit(1);
      }

      const updatedVectorStore = await client.vectorStores.update(vectorStore.id, updateData);

      console.log(chalk.green('✓'), `Vector store "${vectorStore.name}" updated successfully`);

      formatOutput(updatedVectorStore, mergedOptions.format);
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