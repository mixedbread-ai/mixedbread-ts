import { Command } from 'commander';
import {
  addGlobalOptions,
  GlobalOptions,
  GlobalOptionsSchema,
  mergeCommandOptions,
  parseOptions,
} from '../../../utils/global-options';
import { createClient } from '../../../utils/client';
import z from 'zod';
import { resolveVectorStore } from '../../../utils/vector-store';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const DeleteFileSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  fileId: z.string().min(1, { message: '"file-id" is required' }),
  force: z.boolean().optional(),
});

export function createDeleteCommand(): Command {
  const deleteCommand = addGlobalOptions(
    new Command('delete')
      .alias('rm')
      .description('Delete a file from vector store')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<file-id>', 'ID of the file')
      .option('--force', 'Skip confirmation prompt', false),
  );

  deleteCommand.action(
    async (nameOrId: string, fileId: string, options: GlobalOptions & { force?: boolean }) => {
      try {
        const mergedOptions = mergeCommandOptions(deleteCommand, options);

        const parsedOptions = parseOptions(DeleteFileSchema, { ...mergedOptions, nameOrId, fileId });

        const client = createClient(parsedOptions);
        const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

        // Confirmation prompt unless --force is used
        if (!parsedOptions.force) {
          const { confirmed } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmed',
              message: `Are you sure you want to delete file "${parsedOptions.fileId}" from vector store "${vectorStore.name}" (${vectorStore.id})? This action cannot be undone.`,
              default: false,
            },
          ]);

          if (!confirmed) {
            console.log(chalk.yellow('Cancelled.'));
            return;
          }
        }

        const spinner = ora('Deleting file...').start();

        await client.vectorStores.files.delete(parsedOptions.fileId, {
          vector_store_identifier: vectorStore.id,
        });

        spinner.succeed(`File ${parsedOptions.fileId} deleted successfully`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red('Error:'), error.message);
        } else {
          console.error(chalk.red('Error:'), 'Failed to delete file');
        }
        process.exit(1);
      }
    },
  );

  return deleteCommand;
}
