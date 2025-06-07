import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, saveConfig, parseConfigValue } from '../../utils/config';

export function createSetCommand(): Command {
  const setCommand = new Command('set')
    .description('Set configuration values')
    .argument('<key>', 'Configuration key to set')
    .argument('<value>', 'Configuration value to set')
    .action((key: string, value: string) => {
      try {
        const config = loadConfig();

        // Handle nested keys (e.g., "defaults.upload.strategy")
        const keys = key.split('.');
        let current = config;

        // Navigate to the correct nested object
        for (const currentKey of keys.slice(0, -1)) {
          if (!current[currentKey] || typeof current[currentKey] !== 'object') {
            current[currentKey] = {};
          }
          current = current[currentKey];
        }

        const finalKey = keys[keys.length - 1];

        const parsedValue = parseConfigValue(key, value);
        current[finalKey] = parsedValue;

        saveConfig(config);
        console.log(chalk.green('✓'), `Set ${chalk.cyan(key)} to ${chalk.yellow(String(parsedValue))}`);
      } catch (error) {
        console.error(
          chalk.red('Error:'),
          'Failed to set configuration:',
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });

  return setCommand;
}
