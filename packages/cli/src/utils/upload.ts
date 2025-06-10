import { readFileSync } from 'fs';
import { basename } from 'path';
import { lookup } from 'mime-types';
import Mixedbread from '@mixedbread/sdk';

export interface UploadFileOptions {
  metadata?: Record<string, unknown>;
  strategy?: 'fast' | 'high_quality';
  contextualization?: boolean;
}

/**
 * Upload a single file to a vector store
 */
export async function uploadFile(
  client: Mixedbread,
  vectorStoreId: string,
  filePath: string,
  options: UploadFileOptions = {},
): Promise<void> {
  const { metadata = {}, strategy, contextualization } = options;

  // Read file content
  const fileContent = readFileSync(filePath);
  const fileName = basename(filePath);
  const mimeType = lookup(filePath) || 'application/octet-stream';
  const file = new File([fileContent], fileName, { type: mimeType });

  // Upload the file
  await client.vectorStores.files.upload(vectorStoreId, file, {
    metadata,
    experimental: {
      parsing_strategy: strategy,
      contextualization,
    },
  });
}
