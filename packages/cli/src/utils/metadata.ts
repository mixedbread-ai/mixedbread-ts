import chalk from 'chalk';

/**
 * Validates and parses a JSON metadata string
 * @param metadataString The JSON string to parse
 * @returns Parsed metadata object or undefined if input is undefined
 * @throws Exits process with code 1 if JSON is invalid
 */
export function validateMetadata(metadataString?: string): Record<string, unknown> | undefined {
  if (!metadataString) {
    return undefined;
  }

  try {
    return JSON.parse(metadataString);
  } catch (error) {
    console.error(chalk.red('Error:'), 'Invalid JSON in metadata option');
    process.exit(1);
  }
}
