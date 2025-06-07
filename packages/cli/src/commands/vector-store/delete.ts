import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createClient } from '../../utils/client';
import { GlobalOptions, mergeCommandOptions } from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';

interface DeleteOptions extends GlobalOptions {
  force?: boolean;
}

export function createDeleteCommand(): Command {
  const command = new Command('delete')
    .alias('rm')
    .description('Delete a vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .option('--force', 'Skip confirmation prompt', false);

  command.action(async (nameOrId: string, options: DeleteOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const client = createClient(mergedOptions);
      const vectorStore = await resolveVectorStore(client, nameOrId);

      // Confirmation prompt unless --force is used
      if (!mergedOptions.force) {
        const { confirmed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `Are you sure you want to delete vector store "${vectorStore.name}" (${vectorStore.id})? This action cannot be undone.`,
            default: false,
          },
        ]);

        if (!confirmed) {
          console.log(chalk.yellow('Cancelled.'));
          return;
        }
      }

      await client.vectorStores.delete(vectorStore.id);

      console.log(chalk.green('✓'), `Vector store "${vectorStore.name}" deleted successfully`);

    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to delete vector store');
      }
      process.exit(1);
    }
  });

  return command;
}