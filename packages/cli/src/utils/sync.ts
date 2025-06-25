import { getChangedFiles, normalizeGitPatterns } from './git';
import { buildFileSyncMetadata, FileSyncMetadata } from './sync-state';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { calculateFileHash, hashesMatch } from './hash';
import chalk from 'chalk';
import { formatBytes, formatCountWithSuffix } from './output';
import Mixedbread from '@mixedbread/sdk';
import { uploadFile } from './upload';
import ora from 'ora';
import { processWithConcurrency } from './concurrency';

interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  size?: number;
  localHash?: string;
  remoteHash?: string;
  fileId?: string;
}

interface SyncAnalysis {
  added: FileChange[];
  modified: FileChange[];
  deleted: FileChange[];
  unchanged: number;
  totalSize: number;
}

export async function analyzeChanges(
  patterns: string[],
  syncedFiles: Map<string, { fileId: string; metadata: FileSyncMetadata }>,
  gitInfo: { commit: string; branch: string; isRepo: boolean },
  fromGit?: string,
): Promise<SyncAnalysis> {
  const analysis: SyncAnalysis = {
    added: [],
    modified: [],
    deleted: [],
    unchanged: 0,
    totalSize: 0,
  };

  // Get all local files matching patterns
  const localFiles = new Set<string>();
  for (const pattern of patterns) {
    const matches = await glob(pattern, { nodir: true });
    matches.forEach((file) => localFiles.add(path.resolve(file)));
  }

  // Only use git detection if --from-git is explicitly provided
  let gitChanges: Map<string, 'added' | 'modified' | 'deleted'> | null = null;
  if (fromGit && gitInfo.isRepo) {
    const normalizedPatterns = await normalizeGitPatterns(patterns);
    const changes = await getChangedFiles(fromGit, normalizedPatterns);
    gitChanges = new Map(changes.map((c) => [path.resolve(c.path), c.status]));
  }

  // When using --from-git, only process files that git detected as changed
  // Otherwise, process all local files matching patterns (default behavior)
  const filesToProcess = fromGit ? new Set(gitChanges?.keys() || []) : localFiles;

  // Process files
  for (const filePath of filesToProcess) {
    const syncedFile = syncedFiles.get(filePath);

    // Check if file exists locally
    let stats: { size: number } | null = null;
    try {
      stats = await fs.stat(filePath);
    } catch {
      // File doesn't exist locally (might be deleted)
      stats = null;
    }

    if (!stats) continue;

    if (!syncedFile) {
      // New file - only add if it exists locally
      analysis.added.push({
        path: filePath,
        type: 'added',
        size: stats.size,
      });
      analysis.totalSize += stats.size;
    } else {
      // Check if modified
      let isModified = false;
      let localHash: string | undefined;

      if (fromGit && gitChanges && gitChanges.has(filePath)) {
        // When using --from-git, trust git detection
        const gitStatus = gitChanges.get(filePath);
        isModified = gitStatus === 'modified' || gitStatus === 'added';
      } else {
        // Default behavior: use hash comparison
        localHash = await calculateFileHash(filePath);
        isModified = !hashesMatch(localHash, syncedFile.metadata.file_hash);
      }

      if (isModified) {
        analysis.modified.push({
          path: filePath,
          type: 'modified',
          size: stats.size,
          localHash,
          remoteHash: syncedFile.metadata.file_hash,
          fileId: syncedFile.fileId,
        });
        analysis.totalSize += stats.size;
      } else {
        analysis.unchanged++;
      }
    }
  }

  // Check for deleted files
  if (fromGit && gitChanges) {
    // When using --from-git, only process git-detected deletions
    for (const [filePath, gitStatus] of gitChanges) {
      if (gitStatus === 'deleted') {
        const syncedFile = syncedFiles.get(filePath);
        if (syncedFile) {
          // File was deleted in git and exists in vector store - mark for deletion
          analysis.deleted.push({
            path: filePath,
            type: 'deleted',
            fileId: syncedFile.fileId,
          });
        }
      }
    }
  } else {
    // Default behavior: check for files that were previously synced but no longer exist locally
    for (const [filePath, syncedFile] of syncedFiles) {
      if (!localFiles.has(filePath)) {
        analysis.deleted.push({
          path: filePath,
          type: 'deleted',
          fileId: syncedFile.fileId,
        });
      }
    }
  }

  return analysis;
}

export function formatChangeSummary(analysis: SyncAnalysis): string {
  const lines: string[] = [];

  lines.push(chalk.bold('Changes to apply:'));

  if (analysis.modified.length > 0) {
    lines.push(`  ${chalk.yellow('Updated:')} (${formatCountWithSuffix(analysis.modified.length, 'file')})`);
    analysis.modified.forEach((file) => {
      const size = file.size ? ` (${formatBytes(file.size)})` : '';
      lines.push(`    • ${path.relative(process.cwd(), file.path)}${size}`);
    });
    lines.push('');
  }

  if (analysis.added.length > 0) {
    lines.push(`  ${chalk.green('New:')} (${formatCountWithSuffix(analysis.added.length, 'file')})`);
    analysis.added.forEach((file) => {
      const size = file.size ? ` (${formatBytes(file.size)})` : '';
      lines.push(`    • ${path.relative(process.cwd(), file.path)}${size}`);
    });
    lines.push('');
  }

  if (analysis.deleted.length > 0) {
    lines.push(`  ${chalk.red('Deleted:')} (${formatCountWithSuffix(analysis.deleted.length, 'file')})`);
    analysis.deleted.forEach((file) => {
      lines.push(`    • ${path.relative(process.cwd(), file.path)}`);
    });
    lines.push('');
  }

  const totalChanges = analysis.added.length + analysis.modified.length * 2 + analysis.deleted.length;
  const totalUploads = analysis.added.length + analysis.modified.length;
  const totalDeletes = analysis.modified.length + analysis.deleted.length;

  lines.push(
    `Total: ${formatCountWithSuffix(totalChanges, 'change')} (${formatCountWithSuffix(
      totalUploads,
      'file',
    )} to upload, ${formatCountWithSuffix(totalDeletes, 'file')} to delete)`,
  );
  lines.push(`Upload size: ${formatBytes(analysis.totalSize)}`);

  return lines.join('\n');
}

export async function executeSyncChanges(
  client: Mixedbread,
  vectorStoreId: string,
  analysis: SyncAnalysis,
  options: {
    strategy?: 'fast' | 'high_quality';
    metadata?: Record<string, unknown>;
    gitInfo?: { commit: string; branch: string };
    concurrency?: number;
  },
): Promise<void> {
  const concurrency = options.concurrency ?? 5;
  const totalOperations = analysis.added.length + analysis.modified.length * 2 + analysis.deleted.length;
  let completed = 0;

  console.log(chalk.bold('Syncing changes...'));

  try {
    // Delete modified and removed files
    const filesToDelete = [...analysis.modified, ...analysis.deleted].filter((f) => f.fileId);

    if (filesToDelete.length > 0) {
      console.log(chalk.yellow(`\nDeleting ${formatCountWithSuffix(filesToDelete.length, 'file')}...`));

      await processWithConcurrency(
        filesToDelete,
        async (file, index) => {
          const deleteSpinner = ora(`Deleting ${path.relative(process.cwd(), file.path)}`).start();
          try {
            await client.vectorStores.files.delete(file.fileId!, {
              vector_store_identifier: vectorStoreId,
            });
            completed++;
            deleteSpinner.succeed(
              `[${completed}/${totalOperations}] Deleted ${path.relative(process.cwd(), file.path)}`,
            );
          } catch (error) {
            deleteSpinner.fail(`Failed to delete ${path.relative(process.cwd(), file.path)}`);
            throw error;
          }
        },
        concurrency,
      );
    }

    // Upload new and modified files
    const filesToUpload = [...analysis.added, ...analysis.modified];

    if (filesToUpload.length > 0) {
      console.log(chalk.blue(`\nUploading ${formatCountWithSuffix(filesToUpload.length, 'file')}...`));

      await processWithConcurrency(
        filesToUpload,
        async (file, index) => {
          const uploadSpinner = ora(`Uploading ${path.relative(process.cwd(), file.path)}`).start();
          try {
            // Calculate hash if not already done
            const fileHash = file.localHash || (await calculateFileHash(file.path));

            // Build sync metadata
            const syncMetadata = buildFileSyncMetadata(file.path, fileHash, options.gitInfo);

            // Merge with user-provided metadata
            const finalMetadata = {
              ...options.metadata,
              ...syncMetadata,
            };

            // Upload file
            await uploadFile(client, vectorStoreId, file.path, {
              metadata: finalMetadata,
              strategy: options.strategy,
            });

            completed++;
            uploadSpinner.succeed(
              `[${completed}/${totalOperations}] Uploaded ${path.relative(process.cwd(), file.path)}`,
            );
          } catch (error) {
            uploadSpinner.fail(`Failed to upload ${path.relative(process.cwd(), file.path)}`);
            throw error;
          }
        },
        concurrency,
      );
    }

    console.log(chalk.green('\n✓ Sync completed successfully'));
  } catch (error) {
    console.error(chalk.red('\n✗ Sync failed'));
    throw error;
  }
}
