import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

/**
 * Calculate SHA-256 hash of a file
 */
export async function calculateFileHash(filePath: string): Promise<string> {
  const hash = createHash('sha256');
  const stream = createReadStream(filePath);

  await pipeline(stream, hash);

  return `sha256:${hash.digest('hex')}`;
}

/**
 * Calculate SHA-256 hash of a string or buffer
 */
export function calculateHash(content: string | Buffer): string {
  const hash = createHash('sha256');
  hash.update(content);
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Compare two hashes
 */
export function hashesMatch(hash1: string, hash2: string): boolean {
  // Normalize hashes (remove prefix if present)
  const normalize = (hash: string) => {
    if (hash.startsWith('sha256:')) {
      return hash.substring(7);
    }
    return hash;
  };

  return normalize(hash1) === normalize(hash2);
}
