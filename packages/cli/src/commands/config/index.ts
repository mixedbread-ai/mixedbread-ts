import { Command } from 'commander';
import { createSetCommand } from './set';
import { createGetCommand } from './get';

export function createConfigCommand(): Command {
  const configCommand = new Command('config').description('Manage CLI configuration');

  configCommand.addCommand(createSetCommand());
  configCommand.addCommand(createGetCommand());

  return configCommand;
}
