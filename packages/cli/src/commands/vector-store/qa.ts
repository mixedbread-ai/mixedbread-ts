import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient } from '../../utils/client';
import { formatOutput } from '../../utils/output';
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

const QAVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  question: z.string().min(1, { message: '"question" is required' }),
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
  cite: z.boolean().optional(),
  multimodal: z.boolean().optional(),
  returnMetadata: z.boolean().optional(),
});

interface QAOptions extends GlobalOptions {
  topK?: number;
  threshold?: number;
  cite?: boolean;
  multimodal?: boolean;
  returnMetadata?: boolean;
}

export function createQACommand(): Command {
  const command = addGlobalOptions(
    new Command('qa')
      .description('Ask questions about vector store content')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<question>', 'Question to ask')
      .option('--top-k <n>', 'Number of sources to consider')
      .option('--threshold <score>', 'Minimum score threshold for sources')
      .option('--return-metadata', 'Return source metadata'),
  );

  command.action(async (nameOrId: string, question: string, options: QAOptions) => {
    const spinner = ora('Processing question...').start();

    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const parsedOptions = parseOptions(QAVectorStoreSchema, { ...mergedOptions, nameOrId, question });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);
      const config = loadConfig();

      // Get default values from config
      const topK = parsedOptions.topK || config.defaults?.search?.top_k || 10;

      const response = await client.vectorStores.questionAnswering({
        query: parsedOptions.question,
        vector_store_ids: [vectorStore.id],
        top_k: topK,
        search_options: {
          score_threshold: parsedOptions.threshold ? parsedOptions.threshold : undefined,
          return_metadata: parsedOptions.returnMetadata ? parsedOptions.returnMetadata : undefined,
        },
      });

      spinner.succeed('Question processed');

      // Display the answer
      console.log(chalk.bold(chalk.blue('Answer:')));
      console.log(response.answer);

      // Display sources if available
      if (response.sources && response.sources.length > 0) {
        console.log(chalk.bold(chalk.blue('\nSources:')));

        const sources = response.sources.map((source) => {
          const metadata =
            parsedOptions.format === 'table' ? JSON.stringify(source.metadata, null, 2) : source.metadata;

          const output: Record<string, unknown> = {
            filename: source.filename,
            score: source.score.toFixed(2),
            chunk_index: source.chunk_index,
          };

          if (parsedOptions.returnMetadata) {
            output.metadata = metadata;
          }

          return output;
        });

        formatOutput(sources, parsedOptions.format);
      }
    } catch (error) {
      spinner.fail('Failed to process question');
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to process question');
      }
      process.exit(1);
    }
  });

  return command;
}
