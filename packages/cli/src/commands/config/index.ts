import { Command } from 'commander';
import { createSetCommand } from './set';
import { createGetCommand } from './get';

export function createConfigCommand(): Command {
  const configCommand = new Command('config').description('Manage CLI configuration');

  configCommand.addCommand(createSetCommand());
  configCommand.addCommand(createGetCommand());

  // Show help without error exit code when no subcommand provided
  configCommand.action(() => {
    configCommand.help();
  });

  return configCommand;
}
