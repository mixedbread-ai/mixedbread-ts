// Hand-written helpers mixed into the generated `stores.fileBatches` resource.
//
// The generator emits `FileBatchesBase` with the API methods and declares
// `export class FileBatches extends withFileBatchHelpers(FileBatchesBase) {}`, so everything
// defined here is part of `client.stores.fileBatches` and can call the generated methods through `this`.

import type { Uploadable } from '../core/uploads';
import { APIError } from '../core/error';
import type { RequestOptions } from '../internal/request-options';
import type {
  FileBatchCreateParams,
  FileBatchesBase,
  StoreFileBatch,
} from '../resources/stores/file-batches';
import { MultipartUploadError, type MultipartUploadConfig } from './upload-file';

// Backfills are mostly documents of a few MB; multipart sends them straight to storage.
const MULTIPART_THRESHOLD = 5 * 1024 * 1024;
const MAX_FILES = 100;

/**
 * A file with the store fields to add it with.
 */
export interface FileBatchUploadItem extends Omit<FileBatchCreateParams.File, 'file_id'> {
  file: Uploadable;
}

/**
 * Parameters for uploading files to a store in one batch.
 */
export interface FileBatchUploadHelperParams {
  storeIdentifier: string;
  files: Array<Uploadable | FileBatchUploadItem>;
  options?: RequestOptions | undefined;
  multipartUpload?: MultipartUploadConfig | undefined;
  maxConcurrency?: number | undefined;
}

type Constructor<T> = new (...args: any[]) => T;

/**
 * Methods `withFileBatchHelpers` adds to the generated `stores.fileBatches` resource.
 */
export interface FileBatchHelpers {
  /**
   * Upload up to 100 files to the files API and add them to a store in one batch.
   * Each entry is a file or a `FileBatchUploadItem` with its own `external_id`, `metadata` or `config`.
   * Files are uploaded `maxConcurrency` (default 5) at a time and processed asynchronously;
   * multipart is used above 5MB unless `multipartUpload.threshold` says otherwise.
   * `data[i]` is the outcome of `files[i]`; a failed upload has an empty `file_id` and its error.
   */
  upload(params: FileBatchUploadHelperParams): Promise<StoreFileBatch>;
}

function isItem(file: Uploadable | FileBatchUploadItem): file is FileBatchUploadItem {
  return typeof file === 'object' && file !== null && 'file' in file;
}

function uploadFailed(
  item: FileBatchUploadItem,
  error: APIError | MultipartUploadError,
): StoreFileBatch.Data {
  const code = error instanceof APIError ? (error.error as { code?: unknown } | undefined)?.code : undefined;
  return {
    file_id: '',
    external_id: item.external_id ?? null,
    error: { code: typeof code === 'string' ? code : 'upload_error', message: error.message },
  };
}

export function withFileBatchHelpers<TBase extends Constructor<FileBatchesBase>>(
  Base: TBase,
): (new (...args: any[]) => FileBatchHelpers) & TBase {
  return class extends Base implements FileBatchHelpers {
    async upload(params: FileBatchUploadHelperParams): Promise<StoreFileBatch> {
      if (params.files.length < 1 || params.files.length > MAX_FILES) {
        throw new Error(`A batch takes 1 to ${MAX_FILES} files, got ${params.files.length}`);
      }
      const items = params.files.map((file) => (isItem(file) ? file : { file }));
      const multipartUpload = {
        threshold: MULTIPART_THRESHOLD,
        ...params.multipartUpload,
      };
      const uploaded: Array<string | StoreFileBatch.Data> = new Array(items.length);
      let next = 0;
      const worker = async () => {
        while (next < items.length) {
          const i = next++;
          try {
            const file = await this._client.files.create(
              { file: items[i]!.file, multipartUpload },
              params.options,
            );
            uploaded[i] = file.id;
          } catch (error) {
            const perFile = error instanceof APIError || error instanceof MultipartUploadError;
            // A cancelled call rejects, whichever upload path surfaced the abort.
            if (!perFile || params.options?.signal?.aborted) throw error;
            uploaded[i] = uploadFailed(items[i]!, error);
          }
        }
      };
      await Promise.all(Array.from({ length: Math.max(1, params.maxConcurrency ?? 5) }, worker));

      const files = items.flatMap(({ file: _file, ...fields }, i) => {
        const fileId = uploaded[i];
        return typeof fileId === 'string' ? [{ ...fields, file_id: fileId }] : [];
      });
      const added =
        files.length ? (await this.create(params.storeIdentifier, { files }, params.options)).data : [];
      // Put each failed upload back at its position among the batch's results.
      let a = 0;
      return {
        object: 'store.file_batch',
        data: uploaded.map((u) => (typeof u === 'string' ? added[a++]! : u)),
      };
    }
  };
}
