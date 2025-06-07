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
import { loadConfig } from '../../utils/config';
import { z } from 'zod';

const SearchVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  query: z.string().min(1, { message: '"query" is required' }),
  topK: z.coerce
    .number({ message: '"top-k" must be a number' })
    .int({ message: '"top-k" must be an integer' })
    .positive({ message: '"top-k" must be positive' })
    .max(100, { message: '"top-k" must be less than or equal to 100' })
    .optional(),
  threshold: z.coerce
    .number({ message: '"threshold" must be a number' })
    .min(0, { message: '"threshold" must be greater than or equal to 0' })
    .max(1, { message: '"threshold" must be less than or equal to 1' })
    .optional(),
  filter: z.string().optional(),
  rerank: z.boolean().optional(),
  showChunks: z.boolean().optional(),
});

interface SearchOptions extends GlobalOptions {
  topK?: number;
  threshold?: number;
  filter?: string;
  rerank?: boolean;
  showChunks?: boolean;
}

export function createSearchCommand(): Command {
  const command = new Command('search')
    .description('Search within a vector store')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .argument('<query>', 'Search query')
    .option('--top-k <n>', 'Number of results to return')
    .option('--threshold <score>', 'Minimum score threshold')
    .option('--filter <json>', 'Metadata filters as JSON')
    .option('--rerank', 'Enable reranking')
    .option('--show-chunks', 'Display matching chunks', false);

  command.action(async (nameOrId: string, query: string, options: SearchOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);

      const parsedOptions = parseOptions(SearchVectorStoreSchema, { ...mergedOptions, nameOrId, query });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);
      const config = loadConfig();

      // Get default values from config
      const topK = parsedOptions.topK || config.defaults?.search?.top_k || 10;
      const rerank = parsedOptions.rerank ?? config.defaults?.search?.rerank ?? false;

      // Parse filter if provided
      let filter: Record<string, any> | undefined;
      if (parsedOptions.filter) {
        try {
          filter = JSON.parse(parsedOptions.filter);
        } catch (error) {
          console.error(chalk.red('Error:'), 'Invalid JSON in filter option');
          process.exit(1);
        }
      }

      const searchParams: any = {
        query: parsedOptions.query,
        top_k: topK,
        ...(parsedOptions.threshold && { threshold: parsedOptions.threshold }),
        ...(filter && { filter }),
        ...(rerank && { rerank }),
      };

      const results = await (client.vectorStores.search as any)(vectorStore.id, searchParams);

      if (!results.data || results.data.length === 0) {
        console.log(chalk.gray('No results found.'));
        return;
      }

      if (parsedOptions.format === 'json') {
        formatOutput(results, parsedOptions.format);
      } else {
        console.log(chalk.bold(`Found ${results.data.length} results:\n`));

        results.data.forEach((result: any, index: number) => {
          console.log(chalk.blue(`${index + 1}. Score: ${result.score?.toFixed(4) || 'N/A'}`));

          if (result.metadata?.file_path) {
            console.log(chalk.gray(`   File: ${result.metadata.file_path}`));
          }

          if (parsedOptions.showChunks && result.chunk) {
            console.log(
              chalk.white(
                `   Content: ${result.chunk.substring(0, 200)}${result.chunk.length > 200 ? '...' : ''}`,
              ),
            );
          }

          if (result.metadata && Object.keys(result.metadata).length > 0) {
            const filteredMetadata = { ...result.metadata };
            delete filteredMetadata.file_path; // Already shown above
            if (Object.keys(filteredMetadata).length > 0) {
              console.log(chalk.gray(`   Metadata: ${JSON.stringify(filteredMetadata)}`));
            }
          }

          console.log();
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to search vector store');
      }
      process.exit(1);
    }
  });

  return command;
}
