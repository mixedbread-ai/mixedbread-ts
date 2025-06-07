import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import { formatOutput, formatBytes } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { z } from 'zod';

const GetVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
});

interface GetOptions extends GlobalOptions {}

export function createGetCommand(): Command {
  const command = new Command('get')
    .description('Get vector store details')
    .argument('<name-or-id>', 'Name or ID of the vector store');

  command.action(async (nameOrId: string, options: GetOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);

      const parsedOptions = parseOptions(GetVectorStoreSchema, { ...mergedOptions, nameOrId });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      const formattedData = {
        name: vectorStore.name,
        id: vectorStore.id,
        description: vectorStore.description || 'N/A',
        status:
          vectorStore.expires_at && new Date(vectorStore.expires_at) < new Date() ? 'expired' : 'active',
        'total files': vectorStore.file_counts?.total || 0,
        'completed files': vectorStore.file_counts?.completed || 0,
        'processing files': vectorStore.file_counts?.in_progress || 0,
        'failed files': vectorStore.file_counts?.failed || 0,
        usage: formatBytes(vectorStore.usage_bytes || 0),
        'created at': new Date(vectorStore.created_at).toLocaleString(),
        ...(vectorStore.expires_at ?
          {
            'expires at': new Date(vectorStore.expires_at).toLocaleString(),
          }
        : {}),
        ...(vectorStore.metadata && Object.keys(vectorStore.metadata).length > 0 ?
          {
            metadata: JSON.stringify(vectorStore.metadata, null, 2),
          }
        : {}),
      };

      formatOutput(formattedData, parsedOptions.format);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to get vector store details');
      }
      process.exit(1);
    }
  });

  return command;
}
