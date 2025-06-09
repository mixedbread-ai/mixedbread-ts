import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import minimatch from 'minimatch';

const execAsync = promisify(exec);

export interface GitFileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted';
}

export interface GitInfo {
  commit: string;
  branch: string;
  isRepo: boolean;
}

/**
 * Check if the current directory is a git repository
 */
export async function isGitRepo(dir: string = process.cwd()): Promise<boolean> {
  try {
    await execAsync('git rev-parse --is-inside-work-tree', { cwd: dir });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current git commit hash
 */
export async function getCurrentCommit(dir: string = process.cwd()): Promise<string> {
  try {
    const { stdout } = await execAsync('git rev-parse HEAD', { cwd: dir });
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get current commit: ${error}`);
  }
}

/**
 * Get current git branch
 */
export async function getCurrentBranch(dir: string = process.cwd()): Promise<string> {
  try {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: dir });
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get current branch: ${error}`);
  }
}

/**
 * Get git info for the current repository
 */
export async function getGitInfo(dir: string = process.cwd()): Promise<GitInfo> {
  const isRepo = await isGitRepo(dir);

  if (!isRepo) {
    return {
      commit: '',
      branch: '',
      isRepo: false,
    };
  }

  const [commit, branch] = await Promise.all([getCurrentCommit(dir), getCurrentBranch(dir)]);

  return {
    commit,
    branch,
    isRepo: true,
  };
}

/**
 * Get files changed since a specific commit
 */
export async function getChangedFiles(
  fromCommit: string,
  patterns: string[],
  dir: string = process.cwd(),
): Promise<GitFileChange[]> {
  try {
    // Get all changes first (without pathspec filtering since it doesn't work reliably)
    const command = `git diff --name-status ${fromCommit} HEAD`;

    const { stdout } = await execAsync(command, { cwd: dir });

    if (!stdout.trim()) {
      return [];
    }

    // Parse the output
    const allChanges: GitFileChange[] = [];
    const lines = stdout.trim().split('\n');

    for (const line of lines) {
      const [status, ...pathParts] = line.split('\t');
      const filePath = pathParts.join('\t'); // Handle filenames with tabs

      if (!filePath) continue;

      let changeStatus: GitFileChange['status'];
      switch (status[0]) {
        case 'A':
          changeStatus = 'added';
          break;
        case 'M':
          changeStatus = 'modified';
          break;
        case 'D':
          changeStatus = 'deleted';
          break;
        default:
          // For renamed files (R), treat as modified
          changeStatus = 'modified';
      }

      allChanges.push({
        path: filePath,
        status: changeStatus,
      });
    }

    // Filter changes based on patterns using glob matching
    if (patterns.length === 0) {
      return allChanges;
    }

    // Normalize patterns to work with git paths (remove leading ./ if present)
    const normalizedPatterns = patterns.map((pattern) => {
      return pattern.startsWith('./') ? pattern.slice(2) : pattern;
    });

    const filteredChanges = allChanges.filter((change) => {
      return normalizedPatterns.some((pattern) => minimatch(change.path, pattern));
    });

    return filteredChanges;
  } catch (error) {
    // If the commit doesn't exist or other git errors, return empty array
    return [];
  }
}

/**
 * Check if a file is ignored by git
 */
export async function isGitIgnored(filePath: string, dir: string = process.cwd()): Promise<boolean> {
  try {
    // Use git check-ignore to see if file is ignored
    await execAsync(`git check-ignore "${filePath}"`, { cwd: dir });
    return true; // Command succeeds if file is ignored
  } catch {
    return false; // Command fails if file is not ignored
  }
}

/**
 * Get the root directory of the git repository
 */
export async function getGitRoot(dir: string = process.cwd()): Promise<string | null> {
  try {
    const { stdout } = await execAsync('git rev-parse --show-toplevel', { cwd: dir });
    return stdout.trim();
  } catch {
    return null;
  }
}

/**
 * Convert patterns to be relative to git root if in a git repo
 */
export async function normalizeGitPatterns(
  patterns: string[],
  dir: string = process.cwd(),
): Promise<string[]> {
  const gitRoot = await getGitRoot(dir);
  if (!gitRoot) {
    return patterns;
  }

  const cwd = process.cwd();
  const relativeToRoot = path.relative(gitRoot, cwd);

  if (!relativeToRoot) {
    // We're at the git root
    return patterns;
  }

  // Convert patterns to be relative to git root
  return patterns.map((pattern) => {
    if (path.isAbsolute(pattern)) {
      return path.relative(gitRoot, pattern);
    }
    return path.join(relativeToRoot, pattern);
  });
}
