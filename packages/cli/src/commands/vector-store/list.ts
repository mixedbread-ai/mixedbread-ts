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
import { z } from 'zod';

const ListVectorStoreSchema = GlobalOptionsSchema.extend({
  filter: z.string().optional(),
  limit: z.coerce
    .number({ message: '"limit" must be a number' })
    .int({ message: '"limit" must be an integer' })
    .positive({ message: '"limit" must be positive' })
    .max(100, { message: '"limit" must be less than or equal to 100' })
    .optional(),
});

interface ListOptions extends GlobalOptions {
  filter?: string;
  limit?: number;
}

export function createListCommand(): Command {
  const command = addGlobalOptions(
    new Command('list')
      .description('List vector stores')
      .option('--filter <name>', 'Filter by name pattern')
      .option('--limit <n>', 'Maximum number of results', '10'),
  );

  command.action(async (options: ListOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const parsedOptions = parseOptions(ListVectorStoreSchema, mergedOptions);

      const client = createClient(parsedOptions);
      const response = await client.vectorStores.list({
        limit: parsedOptions.limit || 10,
      });

      let vectorStores = response.data;

      // Apply filter if provided
      if (parsedOptions.filter) {
        const filterPattern = parsedOptions.filter.toLowerCase();
        vectorStores = vectorStores.filter((vs) => vs.name.toLowerCase().includes(filterPattern));
      }

      if (vectorStores.length === 0) {
        console.log(chalk.gray('No vector stores found.'));
        return;
      }

      // Format data for output
      const formattedData = vectorStores.map((vs) => ({
        name: vs.name,
        id: vs.id,
        status: vs.expires_at && new Date(vs.expires_at) < new Date() ? 'expired' : 'active',
        files: vs.file_counts?.total,
        usage: formatBytes(vs.usage_bytes),
        created: new Date(vs.created_at).toLocaleDateString(),
      }));

      formatOutput(formattedData, parsedOptions.format);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to list vector stores');
      }
      process.exit(1);
    }
  });

  return command;
}
