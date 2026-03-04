import type { Mixedbread } from '../client';
import type { FileObject, FileCreateParams } from '../resources/files/files';
import type { RequestOptions } from '../internal/request-options';
import type { APIResponseProps } from '../internal/parse';
import { APIPromise } from '../core/api-promise';
import { toFile } from '../internal/to-file';
import { multipartFormRequestOptions } from '../internal/uploads';
import { getDefaultFetch } from '../internal/shims';

const DEFAULT_THRESHOLD = 100 * 1024 * 1024; // 100MB
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_PART_SIZE = 100 * 1024 * 1024; // 100MB per part
const MIN_PART_SIZE = 5 * 1024 * 1024; // 5MB minimum
const MAX_PART_COUNT = 10_000;

export interface PartUploadEvent {
  /** 1-based part number that just completed. */
  partNumber: number;
  /** Total number of parts in this upload. */
  totalParts: number;
  /** Size of this part in bytes. */
  partSize: number;
  /** Cumulative bytes uploaded so far. */
  uploadedBytes: number;
  /** Total file size in bytes. */
  totalBytes: number;
}

export interface MultipartUploadConfig {
  /** Maximum number of concurrent part uploads. Defaults to 5. */
  concurrency?: number;
  /** File size threshold in bytes above which multipart upload is used. Minimum 5MB. Defaults to 100MB. */
  threshold?: number;
  /** Size of each part in bytes. Minimum 5MB. Must not produce more than 10,000 parts. Defaults to 100MB. */
  partSize?: number;
  /** Called after each part is successfully uploaded. */
  onPartUpload?: (event: PartUploadEvent) => void;
}

export class MultipartUploadError extends Error {
  readonly uploadId: string;

  constructor(message: string, uploadId: string) {
    super(message);
    this.name = 'MultipartUploadError';
    this.uploadId = uploadId;
  }
}

function makeResponseProps(response: Response): APIResponseProps {
  return {
    response,
    options: {} as any,
    controller: new AbortController(),
    requestLogID: '',
    retryOfRequestLogID: undefined,
    startTime: Date.now(),
  };
}

export function handleFileCreate(
  client: Mixedbread,
  body: FileCreateParams & { multipartUpload?: MultipartUploadConfig },
  options?: RequestOptions,
): APIPromise<FileObject> {
  let resolvedData: FileObject;

  const responsePromise: Promise<APIResponseProps> = (async () => {
    const { multipartUpload, ...rest } = body;
    const threshold = multipartUpload?.threshold ?? DEFAULT_THRESHOLD;
    const concurrency = multipartUpload?.concurrency ?? DEFAULT_CONCURRENCY;
    const partSize = multipartUpload?.partSize ?? DEFAULT_PART_SIZE;

    if (partSize < MIN_PART_SIZE) {
      throw new Error(`partSize must be at least 5MB (${MIN_PART_SIZE} bytes), got ${partSize}`);
    }

    if (threshold < MIN_PART_SIZE) {
      throw new Error(`threshold must be at least 5MB (${MIN_PART_SIZE} bytes), got ${threshold}`);
    }

    // Normalize the uploadable to a File object so we can inspect size
    const file = await toFile(rest.file as any);
    const fileSize = file.size;

    // Small file: delegate to the standard single-request upload
    if (fileSize <= threshold) {
      const apiPromise = client.post<FileObject>(
        '/v1/files',
        await multipartFormRequestOptions({ body: { file } as Record<string, unknown>, ...options }, client),
      );
      const { data, response } = await apiPromise.withResponse();
      resolvedData = data;
      return makeResponseProps(response);
    }

    // Large file: multipart upload flow
    const partCount = Math.ceil(fileSize / partSize);

    if (partCount > MAX_PART_COUNT) {
      throw new Error(
        `File would require ${partCount} parts, but the maximum is ${MAX_PART_COUNT}. Increase partSize to at least ${Math.ceil(
          fileSize / MAX_PART_COUNT,
        )} bytes.`,
      );
    }
    const filename = file.name || 'unknown_file';
    const mimeType = file.type || 'application/octet-stream';

    // Step 1: Initiate multipart upload
    const uploadResponse = await client.files.uploads.create({
      filename,
      file_size: fileSize,
      mime_type: mimeType,
      part_count: partCount,
    });

    const uploadId = uploadResponse.id;
    const partUrls = uploadResponse.part_urls;

    try {
      // Step 2: Upload parts with concurrency control
      const completedParts = await uploadParts(
        file,
        partUrls,
        concurrency,
        partSize,
        fileSize,
        options?.signal,
        multipartUpload?.onPartUpload,
      );

      // Step 3: Complete the multipart upload
      const completePromise = client.files.uploads.complete(uploadId, { parts: completedParts });
      const { data, response } = await completePromise.withResponse();
      resolvedData = data;
      return makeResponseProps(response);
    } catch (error) {
      // Attempt to abort on any failure
      try {
        await client.files.uploads.abort(uploadId);
      } catch {
        // Abort is best-effort; ignore failures
      }
      if (error instanceof MultipartUploadError) {
        throw error;
      }
      throw new MultipartUploadError(error instanceof Error ? error.message : String(error), uploadId);
    }
  })();

  return new APIPromise<FileObject>(client, responsePromise, async () => resolvedData);
}

interface CompletedPart {
  part_number: number;
  etag: string;
}

async function uploadParts(
  file: File,
  partUrls: Array<{ part_number: number; url: string }>,
  concurrency: number,
  partSize: number,
  fileSize: number,
  signal?: AbortSignal | null,
  onPartUpload?: (event: PartUploadEvent) => void,
): Promise<CompletedPart[]> {
  const fetchFn = getDefaultFetch();
  const results: CompletedPart[] = [];
  const totalParts = partUrls.length;
  let uploadedBytes = 0;
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < partUrls.length) {
      if (signal?.aborted) {
        throw new Error('Upload aborted');
      }

      const index = nextIndex++;
      const { part_number, url } = partUrls[index]!;

      const start = (part_number - 1) * partSize;
      const end = Math.min(start + partSize, fileSize);
      const chunkSize = end - start;
      const blob = file.slice(start, end);

      const response = await fetchFn(url, {
        method: 'PUT',
        body: blob,
        ...(signal ? { signal } : {}),
      });

      if (!response.ok) {
        throw new Error(`Part ${part_number} upload failed with status ${response.status}`);
      }

      const etag = response.headers.get('ETag') || response.headers.get('etag');
      if (!etag) {
        throw new Error(`Part ${part_number} response missing ETag header`);
      }

      results.push({ part_number, etag });

      uploadedBytes += chunkSize;
      onPartUpload?.({
        partNumber: part_number,
        totalParts,
        partSize: chunkSize,
        uploadedBytes,
        totalBytes: fileSize,
      });
    }
  }

  const workerCount = Math.min(concurrency, partUrls.length);
  const workers: Promise<void>[] = [];
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  // Sort by part number for the complete call
  results.sort((a, b) => a.part_number - b.part_number);

  return results;
}
