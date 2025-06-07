import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput, formatBytes } from '../../utils/output';
import { GlobalOptions, mergeCommandOptions } from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import inquirer from 'inquirer';

interface FilesOptions extends GlobalOptions {
  status?: 'all' | 'completed' | 'in_progress' | 'failed';
  limit?: number;
}

export function createFilesCommand(): Command {
  const filesCommand = new Command('files').description('Manage files in vector stores');

  // List files subcommand
  const listCommand = new Command('list')
    .alias('ls')
    .description('List files in a vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .option('--status <status>', 'Filter by status (pending|in_progress|cancelled|completed|failed)', 'all')
    .option('--limit <n>', 'Maximum number of results', '10');

  listCommand.action(async (nameOrId: string, options: FilesOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(listCommand, options);

      // Validate limit option
      if (mergedOptions.limit <= 0) {
        console.error(chalk.red('Error:'), '--limit must be a positive number');
        process.exit(1);
      }

      const client = createClient(mergedOptions);
      const vectorStore = await resolveVectorStore(client, nameOrId);

      const response = await client.vectorStores.files.list(vectorStore.id, {
        limit: mergedOptions.limit || 10,
      });

      let files = response.data;

      // Apply status filter
      if (mergedOptions.status && mergedOptions.status !== 'all') {
        files = files.filter((file: any) => file.status === mergedOptions.status);
      }

      if (files.length === 0) {
        console.log(chalk.gray('No files found.'));
        return;
      }

      // Format data for output
      const formattedData = files.map((file) => ({
        id: file.id,
        name: file.filename,
        status: file.status,
        size: formatBytes(file.usage_bytes),
        created: new Date(file.created_at).toLocaleDateString(),
      }));

      formatOutput(formattedData, mergedOptions.format);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to list files');
      }
      process.exit(1);
    }
  });

  // Get file details subcommand
  const getCommand = new Command('get')
    .description('Get file details')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .argument('<file-id>', 'ID of the file');

  getCommand.action(async (nameOrId: string, fileId: string, options: GlobalOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(getCommand, options);
      const client = createClient(mergedOptions);
      const vectorStore = await resolveVectorStore(client, nameOrId);

      const file = await client.vectorStores.files.retrieve(fileId, {
        vector_store_id: vectorStore.id,
      });

      const formattedData = {
        id: file.id,
        name: file.filename,
        status: file.status,
        size: formatBytes(file.usage_bytes),
        'created at': new Date(file.created_at).toLocaleString(),
        ...(file.metadata && Object.keys(file.metadata).length > 0 ?
          {
            metadata: JSON.stringify(file.metadata, null, 2),
          }
        : {}),
      };

      formatOutput(formattedData, mergedOptions.format);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to get file details');
      }
      process.exit(1);
    }
  });

  // Delete file subcommand
  const deleteCommand = new Command('delete')
    .alias('rm')
    .description('Delete a file from vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .argument('<file-id>', 'ID of the file')
    .option('--force', 'Skip confirmation prompt', false);

  deleteCommand.action(
    async (nameOrId: string, fileId: string, options: GlobalOptions & { force?: boolean }) => {
      try {
        const mergedOptions = mergeCommandOptions(deleteCommand, options);
        const client = createClient(mergedOptions);
        const vectorStore = await resolveVectorStore(client, nameOrId);

        // Confirmation prompt unless --force is used
        if (!mergedOptions.force) {
          const { confirmed } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmed',
              message: `Are you sure you want to delete file "${fileId}" from vector store "${vectorStore.name}" (${vectorStore.id})? This action cannot be undone.`,
              default: false,
            },
          ]);

          if (!confirmed) {
            console.log(chalk.yellow('Cancelled.'));
            return;
          }
        }

        await client.vectorStores.files.delete(fileId, {
          vector_store_id: vectorStore.id,
        });

        console.log(chalk.green('✓'), `File ${fileId} deleted successfully`);
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

  // Add subcommands
  filesCommand.addCommand(listCommand);
  filesCommand.addCommand(getCommand);
  filesCommand.addCommand(deleteCommand);

  // Default action (same as list)
  filesCommand.action(async (nameOrId: string, options: FilesOptions) => {
    await listCommand.parseAsync([nameOrId], { from: 'user' });
  });

  return filesCommand;
}
