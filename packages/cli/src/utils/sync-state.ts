import Mixedbread from '@mixedbread/sdk';

export interface SyncState {
  last_sync: string;
  git_commit?: string;
  git_branch?: string;
  file_count: number;
  patterns: string[];
}

export interface FileSyncMetadata {
  file_path: string;
  file_hash: string;
  git_commit?: string;
  git_branch?: string;
  uploaded_at: string;
  synced: boolean;
}

/**
 * Get all synced files from vector store
 */
export async function getSyncedFiles(
  client: Mixedbread,
  vectorStoreId: string,
): Promise<Map<string, { fileId: string; metadata: FileSyncMetadata }>> {
  const fileMap = new Map<string, { fileId: string; metadata: FileSyncMetadata }>();

  try {
    // Get all files in the vector store
    // Note: In a real implementation, this would need pagination
    const response = await client.vectorStores.files.list(vectorStoreId, {
      limit: 100,
    });

    for (const file of response.data) {
      // Check if file has sync metadata
      const metadata = file.metadata as FileSyncMetadata;
      if (metadata && metadata.synced === true && metadata.file_path) {
        fileMap.set(metadata.file_path, {
          fileId: file.id,
          metadata,
        });
      }
    }

    return fileMap;
  } catch (error) {
    throw new Error(`Failed to get synced files: ${error}`);
  }
}

/**
 * Build file sync metadata
 */
export function buildFileSyncMetadata(
  filePath: string,
  fileHash: string,
  gitInfo?: { commit: string; branch: string },
): FileSyncMetadata {
  const metadata: FileSyncMetadata = {
    file_path: filePath,
    file_hash: fileHash,
    uploaded_at: new Date().toISOString(),
    synced: true,
  };

  if (gitInfo) {
    metadata.git_commit = gitInfo.commit;
    metadata.git_branch = gitInfo.branch;
  }

  return metadata;
}
