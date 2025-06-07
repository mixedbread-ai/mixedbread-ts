import { Mixedbread } from '@mixedbread/sdk';
import type { VectorStore } from '@mixedbread/sdk/resources/vector-stores';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { resolveVectorStoreName } from './config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function resolveVectorStore(
  client: Mixedbread,
  nameOrId: string,
  interactive = false,
): Promise<VectorStore> {
  // First check if it's an alias
  const resolved = resolveVectorStoreName(nameOrId);

  // If it looks like a UUID, try to get it directly
  if (UUID_REGEX.test(resolved)) {
    try {
      return await client.vectorStores.retrieve(resolved);
    } catch (error) {
      // If not found by ID, fall through to name search
    }
  }

  // Search by name
  const vectorStores = await client.vectorStores.list({ limit: 100 });
  const matches = vectorStores.data.filter((vs) => vs.name === resolved);

  if (matches.length === 0) {
    // No exact match, try fuzzy matching
    const fuzzyMatches = vectorStores.data.filter((vs) =>
      vs.name.toLowerCase().includes(resolved.toLowerCase()),
    );

    if (fuzzyMatches.length === 0) {
      console.error(chalk.red('Error:'), `Vector store "${nameOrId}" not found.\n`);
      console.error("Run 'mxbai vs list' to see all vector stores.");
      process.exit(1);
    }

    if (fuzzyMatches.length === 1) {
      return fuzzyMatches[0];
    }

    // Multiple fuzzy matches
    if (interactive) {
      const { selected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selected',
          message: 'Multiple vector stores found. Select one:',
          choices: fuzzyMatches.map((vs) => ({
            name: `${vs.name} (${vs.id})`,
            value: vs,
          })),
        },
      ]);
      return selected;
    } else {
      console.error(chalk.red('Error:'), `Vector store "${nameOrId}" not found.\n`);
      console.error('Did you mean one of these?');
      fuzzyMatches.forEach((vs) => {
        console.error(`  • ${vs.name}`);
      });
      console.error("\nRun 'mxbai vs list' to see all vector stores.");
      process.exit(1);
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  // Multiple exact matches (shouldn't happen once names are unique)
  // if (interactive) {
  //   const { selected } = await inquirer.prompt([
  //     {
  //       type: 'list',
  //       name: 'selected',
  //       message: 'Multiple vector stores with the same name found. Select one:',
  //       choices: matches.map((vs) => ({
  //         name: `${vs.name} (${vs.id})`,
  //         value: vs,
  //       })),
  //     },
  //   ]);
  //   return selected;
  // } else {
  //   console.error(chalk.red('Error:'), `Multiple vector stores named "${resolved}" found.`);
  //   console.error('Please use the ID instead:');
  //   matches.forEach((vs) => {
  //     console.error(`  • ${vs.id}`);
  //   });
  //   process.exit(1);
  // }
}
