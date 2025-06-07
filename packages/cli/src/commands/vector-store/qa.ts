import { Command } from 'commander';
import chalk from 'chalk';
import { createClient } from '../../utils/client';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { z } from 'zod';

const QAVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  question: z.string().min(1, { message: '"question" is required' }),
  model: z.string().optional(),
  temperature: z.coerce
    .number({ message: '"temperature" must be a number' })
    .min(0, { message: '"temperature" must be greater than or equal to 0' })
    .max(2, { message: '"temperature" must be less than or equal to 2' })
    .optional(),
  maxTokens: z.coerce
    .number({ message: '"max-tokens" must be a number' })
    .int({ message: '"max-tokens" must be an integer' })
    .positive({ message: '"max-tokens" must be positive' })
    .max(4096, { message: '"max-tokens" must be less than or equal to 4096' })
    .optional(),
});

interface QAOptions extends GlobalOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createQACommand(): Command {
  const command = new Command('qa')
    .description('Ask questions about vector store content')
    .argument('<name-or-id>', 'Name or ID of the vector store')
    .argument('<question>', 'Question to ask')
    .option('--model <model-name>', 'Model to use for question answering')
    .option('--temperature <n>', 'Temperature for response generation')
    .option('--max-tokens <n>', 'Maximum tokens in response');

  command.action(async (nameOrId: string, question: string, options: QAOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);

      const parsedOptions = parseOptions(QAVectorStoreSchema, { ...mergedOptions, nameOrId, question });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      // Build QA parameters
      const qaParams: any = {
        question: parsedOptions.question,
        ...(parsedOptions.model && { model: parsedOptions.model }),
        ...(parsedOptions.temperature !== undefined && { temperature: parsedOptions.temperature }),
        ...(parsedOptions.maxTokens && { max_tokens: parsedOptions.maxTokens }),
      };

      // Note: This assumes the SDK has a QA endpoint - we'll need to check the actual API
      // For now, this is a placeholder implementation
      console.log(chalk.yellow('Note: Question answering feature is not yet implemented in the SDK.'));
      console.log(chalk.gray('For now, you can use the search command to find relevant content:'));
      console.log(chalk.blue(`mxbai vs search "${parsedOptions.nameOrId}" "${parsedOptions.question}"`));

      // TODO: Implement actual QA once available in SDK
      // const response = await client.vectorStores.qa(vectorStore.id, qaParams);
    } catch (error) {
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
