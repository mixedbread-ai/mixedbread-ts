import type { Command } from "commander";

export interface GlobalOptions {
  apiKey?: string;
  format?: "table" | "json" | "csv";
  debug?: boolean;
}

export function setupGlobalOptions(program: Command): void {
  program
    .option("--api-key <key>", "API key for authentication")
    .option("--format <format>", "Output format", "table")
    .option("--debug", "Enable debug output", false)
    .hook("preAction", (thisCommand) => {
      // Set debug mode from environment or flag
      if (thisCommand.opts().debug || process.env.MXBAI_DEBUG === "true") {
        process.env.MXBAI_DEBUG = "true";
      }
    });
}

export function addGlobalOptions(command: Command): Command {
  return command
    .option("--api-key <key>", "API key for authentication")
    .option("--format <format>", "Output format (table|json|csv)");
}

export function mergeCommandOptions(command: Command, options: any): any {
  // Traverse up the command hierarchy to collect all options
  const allOptions: any[] = [];
  let currentCommand: Command | null = command;

  // Collect options from all parent commands up to the root
  while (currentCommand) {
    if (currentCommand.parent) {
      allOptions.unshift(currentCommand.parent.opts());
    }
    currentCommand = currentCommand.parent;
  }

  // Add the current command's options last (highest priority)
  allOptions.push(options);

  // Merge all options, with later options taking priority
  const merged = Object.assign({}, ...allOptions);

  if (process.env.MXBAI_DEBUG === "true") {
    console.log("Command hierarchy options:", allOptions);
    console.log("Merged options:", merged);
  }

  return merged;
}
