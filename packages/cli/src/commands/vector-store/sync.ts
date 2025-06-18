import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient } from '../../utils/client';
import {
  GlobalOptions,
  GlobalOptionsSchema,
  addGlobalOptions,
  mergeCommandOptions,
  parseOptions,
} from '../../utils/global-options';
import { resolveVectorStore } from '../../utils/vector-store';
import { validateMetadata } from '../../utils/metadata';
import { z } from 'zod';
import { getGitInfo } from '../../utils/git';
import { getSyncedFiles } from '../../utils/sync-state';
import { analyzeChanges, executeSyncChanges, formatChangeSummary } from '../../utils/sync';
import { formatCountWithSuffix } from '../../utils/output';

const SyncVectorStoreSchema = GlobalOptionsSchema.extend({
  nameOrId: z.string().min(1, { message: '"name-or-id" is required' }),
  patterns: z.array(z.string()).min(1, { message: 'At least one pattern is required' }),
  strategy: z.enum(['fast', 'high_quality']).optional(),
  fromGit: z.string().optional(),
  dryRun: z.boolean().optional(),
  force: z.boolean().optional(),
  metadata: z.string().optional(),
  ci: z.boolean().optional(),
});

interface SyncOptions extends GlobalOptions {
  strategy?: 'fast' | 'high_quality';
  fromGit?: string;
  dryRun?: boolean;
  force?: boolean;
  metadata?: string;
  ci?: boolean;
}

export function createSyncCommand(): Command {
  const command = addGlobalOptions(
    new Command('sync')
      .description('Sync files with vector store (intelligent change detection)')
      .argument('<name-or-id>', 'Name or ID of the vector store')
      .argument('<patterns...>', 'File patterns to sync')
      .option('--strategy <strategy>', 'Upload strategy (fast|high_quality)', 'fast')
      .option('--from-git <ref>', 'Only sync files changed since git ref (default: last sync)')
      .option('--dry-run', 'Show what would change without making changes')
      .option('--force', 'Skip confirmation prompt')
      .option('--metadata <json>', 'Additional metadata for files')
      .option('--ci', 'Non-interactive mode for CI/CD'),
  );

  command.action(async (nameOrId: string, patterns: string[], options: SyncOptions) => {
    try {
      const mergedOptions = mergeCommandOptions(command, options);
      const parsedOptions = parseOptions(SyncVectorStoreSchema, {
        ...mergedOptions,
        nameOrId,
        patterns,
      });

      const client = createClient(parsedOptions);
      const vectorStore = await resolveVectorStore(client, parsedOptions.nameOrId);

      console.log(chalk.bold(`Syncing "${vectorStore.name}" vector store...`));
      console.log(`Patterns: ${patterns.join(', ')}\n`);

      // Parse metadata if provided
      const additionalMetadata = validateMetadata(parsedOptions.metadata);

      // Get git info
      const gitInfo = await getGitInfo();

      // Get sync state and synced files
      const spinner = ora('Analyzing changes...').start();

      const syncedFiles = await getSyncedFiles(client, vectorStore.id);

      spinner.stop();
      console.log(
        chalk.gray(`Found ${formatCountWithSuffix(syncedFiles.size, 'existing file')} in vector store`),
      );

      // Only use git if --from-git is explicitly provided
      const fromGit = parsedOptions.fromGit;

      if (fromGit && gitInfo.isRepo) {
        console.log(chalk.gray(`Using git-based detection (from commit ${fromGit.substring(0, 7)})`));
      } else if (fromGit && !gitInfo.isRepo) {
        console.error(chalk.red('Error:'), '--from-git specified but not in a git repository');
        process.exit(1);
      } else {
        console.log(chalk.gray('Using local file comparison (hash-based detection)'));
      }

      // Analyze changes
      const analyzeSpinner = ora('Analyzing file changes...').start();
      const analysis = await analyzeChanges(patterns, syncedFiles, gitInfo, fromGit);

      analyzeSpinner.succeed('Analysis complete');

      // Check if there are any changes
      const totalChanges = analysis.added.length + analysis.modified.length + analysis.deleted.length;

      if (totalChanges === 0) {
        console.log(chalk.green('✓'), 'Vector store is already in sync');
        return;
      }

      // Show summary
      console.log(`${formatChangeSummary(analysis)}\n`);

      // Dry run mode - just show what would happen
      if (parsedOptions.dryRun) {
        console.log(chalk.yellow('Dry run mode - no changes were made'));
        return;
      }

      // Confirm changes unless in CI mode or force flag is set
      if (!parsedOptions.ci && !parsedOptions.force) {
        const { default: inquirer } = await import('inquirer');
        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Proceed?',
            default: false,
          },
        ]);

        if (!proceed) {
          console.log(chalk.gray('Sync cancelled'));
          return;
        }
      }

      // Execute changes
      await executeSyncChanges(client, vectorStore.id, analysis, {
        strategy: parsedOptions.strategy,
        metadata: additionalMetadata,
        gitInfo: gitInfo.isRepo ? gitInfo : undefined,
      });

      // Update sync state
      const newSyncState = {
        last_sync: new Date().toISOString(),
        git_commit: fromGit && gitInfo.isRepo ? gitInfo.commit : undefined,
        git_branch: fromGit && gitInfo.isRepo ? gitInfo.branch : undefined,
        file_count: syncedFiles.size + analysis.added.length - analysis.deleted.length,
        patterns,
      };

      // Summary
      console.log('');
      console.log(chalk.bold('Summary:'));
      console.log(
        chalk.green('✓'),
        `${formatCountWithSuffix(
          analysis.added.length + analysis.modified.length,
          'file',
        )} uploaded successfully`,
      );
      console.log(
        chalk.green('✓'),
        `${formatCountWithSuffix(
          analysis.modified.length + analysis.deleted.length,
          'file',
        )} deleted (${formatCountWithSuffix(analysis.modified.length, 'update')} + ${formatCountWithSuffix(
          analysis.deleted.length,
          'removal',
        )})`,
      );
      console.log(chalk.green('✓'), 'Vector store is now in sync');

      if (fromGit && gitInfo.isRepo) {
        console.log(
          chalk.green('✓'),
          `Sync state saved (commit: ${gitInfo.commit.substring(0, 7)}, patterns: ${patterns.join(', ')})`,
        );
      } else {
        console.log(chalk.green('✓'), `Sync state saved (patterns: ${patterns.join(', ')})`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'Failed to sync vector store');
      }
      process.exit(1);
    }
  });

  return command;
}
