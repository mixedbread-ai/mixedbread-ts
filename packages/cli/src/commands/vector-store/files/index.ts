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

  const listCommand = createListCommand();
  const getCommand = createGetCommand();
  const deleteCommand = createDeleteCommand();

  // Add subcommands
  filesCommand.addCommand(listCommand);
  filesCommand.addCommand(getCommand);
  filesCommand.addCommand(deleteCommand);

  // Default action (same as list)
  filesCommand.action(async (nameOrId: string) => {
    await listCommand.parseAsync([nameOrId], { from: 'user' });
  });

  return filesCommand;
}
