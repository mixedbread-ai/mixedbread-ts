import { Command } from 'commander';
import { createListCommand } from './list';
import { createCreateCommand } from './create';
import { createGetCommand } from './get';
import { createDeleteCommand } from './delete';
import { createUpdateCommand } from './update';
import { createUploadCommand } from './upload';
import { createFilesCommand } from './files';
import { createSearchCommand } from './search';
import { createQACommand } from './qa';
import { createSyncCommand } from './sync';

export function createVectorStoreCommand(): Command {
  const vsCommand = new Command('vs').alias('vector-store').description('Manage vector stores');

  // Add subcommands
  vsCommand.addCommand(createListCommand());
  vsCommand.addCommand(createCreateCommand());
  vsCommand.addCommand(createGetCommand());
  vsCommand.addCommand(createUpdateCommand());
  vsCommand.addCommand(createDeleteCommand());
  vsCommand.addCommand(createUploadCommand());
  vsCommand.addCommand(createFilesCommand());
  vsCommand.addCommand(createSearchCommand());
  vsCommand.addCommand(createQACommand());
  vsCommand.addCommand(createSyncCommand());

  // Show help without error exit code when no subcommand provided
  vsCommand.action(() => {
    vsCommand.help();
  });

  return vsCommand;
}
