import { Command } from 'commander';
import { GlobalOptions } from '../../../utils/global-options';
import { createListCommand } from './list';
import { createGetCommand } from './get';
import { createDeleteCommand } from './delete';

export interface FilesOptions extends GlobalOptions {
  status?: 'all' | 'completed' | 'in_progress' | 'failed';
  limit?: number;
}

export function createFilesCommand(): Command {
  const filesCommand = new Command('files').description('Manage files in vector stores');

  // Add subcommands
  filesCommand.addCommand(createListCommand());
  filesCommand.addCommand(createGetCommand());
  filesCommand.addCommand(createDeleteCommand());

  filesCommand.action(() => {
    filesCommand.help();
  });

  return filesCommand;
}
