import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../../utils/config';

export function createGetCommand(): Command {
  const getCommand = new Command('get')
    .description('Get configuration values')
    .argument('[key]', 'Configuration key to get (omit to show all)')
    .action((key?: string) => {
      try {
        const config = loadConfig();

        if (!key) {
          console.log(chalk.cyan('Current configuration:'));
          console.log(JSON.stringify(config, null, 2));
          return;
        }

        // Handle nested keys (e.g., "defaults.upload.strategy")
        const keys = key.split('.');
        let current = config;

        for (const currentKey of keys) {
          if (current && typeof current === 'object' && currentKey in current) {
            current = current[currentKey];
          } else {
            console.error(chalk.red('Error:'), `Configuration key ${chalk.cyan(key)} not found`);
            process.exit(1);
          }
        }

        console.log(chalk.cyan(key + ':'), JSON.stringify(current, null, 2));
      } catch (error) {
        console.error(
          chalk.red('Error:'),
          'Failed to get configuration:',
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });

  return getCommand;
}
