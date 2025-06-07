#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
const { version } = require('../../package.json');
import { createVectorStoreCommand } from '../commands/vector-store';
import { setupGlobalOptions } from '../utils/global-options';

const program = new Command();

program
  .name('mxbai')
  .description('CLI tool for managing Mixedbread vector stores and files')
  .version(version)
  .allowExcessArguments(false);

// Set up global options
setupGlobalOptions(program);

// Add vector store commands
program.addCommand(createVectorStoreCommand());

// Global error handling
program.on('error', (error: Error) => {
  console.error(chalk.red('Error:'), error.message);
  if (process.env.MXBAI_DEBUG === 'true') {
    console.error(chalk.gray(error.stack));
  }
  process.exit(1);
});

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('Error:'), `Unknown command: ${program.args.join(' ')}`);
  console.log();
  program.help();
});

// Parse arguments
async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red('Error:'), error.message);
      if (process.env.MXBAI_DEBUG === 'true') {
        console.error(chalk.gray(error.stack));
      }
    }
    process.exit(1);
  }
}

main();
