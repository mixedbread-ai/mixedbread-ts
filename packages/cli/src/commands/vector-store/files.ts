import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput, formatBytes } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  addGlobalOptions,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import inquirer from 'inquirer';
import { z } from 'zod';

const ListFilesSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  status: z
    .enum(['all', 'completed', 'in_progress', 'failed'], {
      message: '"status" must be one of: all, completed, in_progress, failed',
    })
    .optional(),
  limit: z.coerce
    .number({ message: '"limit" must be a number' })
    .int({ message: '"limit" must be an integer' })
    .positive({ message: '"limit" must be positive' })
    .max(1000, { message: '"limit" must be less than or equal to 1000' })
    .optional(),
});

const GetFileSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  fileId: z.string().min(1, { message: '"file-id" is required' }),
});

const DeleteFileSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  fileId: z.string().min(1, { message: '"file-id" is required' }),
  force: z.boolean().optional(),
});

interface FilesOptions extends GlobalOptions {
  status?: 'all' | 'completed' | 'in_progress' | 'failed';
  limit?: number;
}

export function createFilesCommand(): Command {
  const filesCommand = new Command('files').description('Manage files in vector stores');

  // List files subcommand
  const listCommand = addGlobalOptions(
    new Command('list')
      .alias('ls')
      .description('List files in a vector store')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .option('--status <status>', 'Filter by status (pending|in_progress|cancelled|completed|failed)', 'all')
      .option('--limit <n>', 'Maximum number of results', '10'),
  );

  listCommand.action(async (nameOrId: string, options: FilesOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(listCommand, options);

      const parsedOptions = parseOptions(ListFilesSchema, { ...mergedOptions, nameOrId });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      const response = await client.vectorStores.files.list(vectorStore.id, {
        limit: parsedOptions.limit || 10,
      });

      let files = response.data;

      // Apply status filter
      if (parsedOptions.status && parsedOptions.status !== 'all') {
        files = files.filter((file: any) => file.status === parsedOptions.status);
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
        metadata: parsedOptions.format === 'table' ? JSON.stringify(file.metadata, null, 2) : file.metadata,
        created: new Date(file.created_at).toLocaleDateString(),
      }));

      formatOutput(formattedData, parsedOptions.format);
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
  const getCommand = addGlobalOptions(
    new Command('get')
      .description('Get file details')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<file-id>', 'ID of the file'),
  );

  getCommand.action(async (nameOrId: string, fileId: string, options: GlobalOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(getCommand, options);

      const parsedOptions = parseOptions(GetFileSchema, { ...mergedOptions, nameOrId, fileId });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      const file = await client.vectorStores.files.retrieve(parsedOptions.fileId, {
        vector_store_id: vectorStore.id,
      });

      const formattedData = {
        id: file.id,
        name: file.filename,
        status: file.status,
        size: formatBytes(file.usage_bytes),
        'created at': new Date(file.created_at).toLocaleString(),
        metadata: parsedOptions.format === 'table' ? JSON.stringify(file.metadata, null, 2) : file.metadata,
      };

      formatOutput(formattedData, parsedOptions.format);
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

        await client.vectorStores.files.delete(parsedOptions.fileId, {
          vector_store_id: vectorStore.id,
        });

        console.log(chalk.green('✓'), `File ${parsedOptions.fileId} deleted successfully`);
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
