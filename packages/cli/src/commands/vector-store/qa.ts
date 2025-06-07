import { Command } from "commander";
import chalk from "chalk";
import { createClient } from "../../utils/client";
import { formatOutput } from "../../utils/output";
import {
  type GlobalOptions,
  mergeCommandOptions,
} from "../../utils/global-options";
import { resolveVectorStore } from "../../utils/vector-store";

interface QAOptions extends GlobalOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createQACommand(): Command {
  const command = new Command("qa")
    .description("Ask questions about vector store content")
    .argument("<name-or-id>", "Name or ID of the vector store")
    .argument("<question>", "Question to ask")
    .option("--model <model-name>", "Model to use for question answering")
    .option(
      "--temperature <n>",
      "Temperature for response generation",
      Number.parseFloat
    )
    .option("--max-tokens <n>", "Maximum tokens in response", Number.parseInt);

  command.action(
    async (nameOrId: string, question: string, options: QAOptions) => {
      try {
        const mergedOptions = mergeCommandOptions(command, options);
        const client = createClient(mergedOptions);
        const vectorStore = await resolveVectorStore(client, nameOrId);

        // Build QA parameters
        const qaParams: any = {
          question,
          ...(mergedOptions.model && { model: mergedOptions.model }),
          ...(mergedOptions.temperature !== undefined && {
            temperature: mergedOptions.temperature,
          }),
          ...(mergedOptions.maxTokens && {
            max_tokens: mergedOptions.maxTokens,
          }),
        };

        // Note: This assumes the SDK has a QA endpoint - we'll need to check the actual API
        // For now, this is a placeholder implementation
        console.log(
          chalk.yellow(
            "Note: Question answering feature is not yet implemented in the SDK."
          )
        );
        console.log(
          chalk.gray(
            "For now, you can use the search command to find relevant content:"
          )
        );
        console.log(chalk.blue(`mxbai vs search "${nameOrId}" "${question}"`));

        // TODO: Implement actual QA once available in SDK
        // const response = await client.vectorStores.qa(vectorStore.id, qaParams);
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red("Error:"), error.message);
        } else {
          console.error(chalk.red("Error:"), "Failed to process question");
        }
        process.exit(1);
      }
    }
  );

  return command;
}
