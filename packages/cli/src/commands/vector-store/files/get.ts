import { Command } from 'commander';
import {
  addGlobalOptions,
  GlobalOptions,
  GlobalOptionsSchema,
  mergeCommandOptions,
  parseOptions,
} from '../../../utils/global-options';
import ora from 'ora';
import { createClient } from '../../../utils/client';
import { resolveVectorStore } from '../../../utils/vector-store';
import { formatBytes, formatOutput } from '../../../utils/output';
import chalk from 'chalk';
import { z } from 'zod';

const GetFileSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  fileId: z.string().min(1, { message: '"file-id" is required' }),
});

export function createGetCommand(): Command {
  const getCommand = addGlobalOptions(
    new Command('get')
      .description('Get file details')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<file-id>', 'ID of the file'),
  );

  getCommand.action(async (nameOrId: string, fileId: string, options: GlobalOptions) => {
    const spinner = ora('Loading file details...').start();

    try {
      const mergedOptions = mergeCommandOptions(getCommand, options);

      const parsedOptions = parseOptions(GetFileSchema, { ...mergedOptions, nameOrId, fileId });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      const file = await client.vectorStores.files.retrieve(parsedOptions.fileId, {
        vector_store_identifier: vectorStore.id,
      });

      spinner.succeed('File details loaded');

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
      spinner.fail('Failed to load file details');
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to get file details');
      }
      process.exit(1);
    }
  });

  return getCommand;
}
