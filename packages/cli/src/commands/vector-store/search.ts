import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient } from '../../utils/client';
import { formatOutput, formatCountWithSuffix } from '../../utils/output';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  addGlobalOptions,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { loadConfig } from '../../utils/config';
import { z } from 'zod';
import Mixedbread from '@mixedbread/sdk';

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
  returnMetadata: z.boolean().optional(),
  rerank: z.boolean().optional(),
  showChunks: z.boolean().optional(),
});

type ParsedSearchOptions = z.infer<typeof SearchVectorStoreSchema> & { vectorStoreId: string };

async function searchVectorStoreFiles(client: Mixedbread, parsedOptions: ParsedSearchOptions) {
  return await client.vectorStores.files.search({
    query: parsedOptions.query,
    vector_store_ids: [parsedOptions.vectorStoreId],
    top_k: parsedOptions.topK,
    search_options: {
      return_metadata: parsedOptions.returnMetadata,
      score_threshold: parsedOptions.threshold,
      rerank: parsedOptions.rerank,
    },
  });
}

async function searchVectorStoreChunks(client: Mixedbread, parsedOptions: ParsedSearchOptions) {
  return await client.vectorStores.search({
    query: parsedOptions.query,
    vector_store_ids: [parsedOptions.vectorStoreId],
    top_k: parsedOptions.topK,
    search_options: {
      return_metadata: parsedOptions.returnMetadata,
      score_threshold: parsedOptions.threshold,
      rerank: parsedOptions.rerank,
    },
  });
}

interface SearchOptions extends GlobalOptions {
  topK?: number;
  threshold?: number;
  returnMetadata?: boolean;
  rerank?: boolean;
  showChunks?: boolean;
}

export function createSearchCommand(): Command {
  const command = addGlobalOptions(
    new Command('search')
      .description('Search within a vector store')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<query>', 'Search query')
      .option('--top-k <n>', 'Number of results to return')
      .option('--threshold <score>', 'Minimum score threshold')
      .option('--return-metadata', 'Return metadata')
      .option('--rerank', 'Enable reranking')
      .option('--show-chunks', 'Display matching chunks', false),
  );

  command.action(async (nameOrId: string, query: string, options: SearchOptions) => {
    const spinner = ora('Searching vector store...').start();

    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const parsedOptions = parseOptions(SearchVectorStoreSchema, { ...mergedOptions, nameOrId, query });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);
      const config = loadConfig();

      // Get default values from config
      const topK = parsedOptions.topK || config.defaults?.search?.top_k || 10;
      const rerank = parsedOptions.rerank ?? config.defaults?.search?.rerank ?? false;

      const results =
        parsedOptions.showChunks ?
          await searchVectorStoreChunks(client, {
            ...parsedOptions,
            vectorStoreId: vectorStore.id,
            topK,
            rerank,
          })
        : await searchVectorStoreFiles(client, {
            ...parsedOptions,
            vectorStoreId: vectorStore.id,
            topK,
            rerank,
          });

      if (!results.data || results.data.length === 0) {
        spinner.info('No results found.');
        return;
      }

      spinner.succeed(`Found ${formatCountWithSuffix(results.data.length, 'result')}`);

      const output = results.data.map((result) => {
        const metadata =
          parsedOptions.format === 'table' ? JSON.stringify(result.metadata, null, 2) : result.metadata;

        const output: Record<string, unknown> = {
          filename: result.filename,
          score: result.score.toFixed(2),
          vector_store_id: result.vector_store_id,
        };

        if (parsedOptions.showChunks) {
          output.chunk_index = result.chunk_index;
        }

        if (parsedOptions.returnMetadata) {
          output.metadata = metadata;
        }

        return output;
      });

      formatOutput(output, parsedOptions.format);
    } catch (error) {
      spinner.fail('Search failed');
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
