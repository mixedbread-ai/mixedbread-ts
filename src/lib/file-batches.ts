// Hand-written helpers mixed into the generated `stores.fileBatches` resource.
//
// The generator emits `FileBatchesBase` with the API methods and declares
// `export class FileBatches extends withFileBatchHelpers(FileBatchesBase) {}`, so everything
// defined here is part of `client.stores.fileBatches` and can call the generated methods through `this`.

import type { Uploadable } from '../core/uploads';
import type { RequestOptions } from '../internal/request-options';
import type {
  FileBatchCreateParams,
  FileBatchesBase,
  StoreFileBatch,
} from '../resources/stores/file-batches';
import type { MultipartUploadConfig } from './upload-file';

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
   */
  upload(params: FileBatchUploadHelperParams): Promise<StoreFileBatch>;
}

function isItem(file: Uploadable | FileBatchUploadItem): file is FileBatchUploadItem {
  return typeof file === 'object' && file !== null && 'file' in file;
}

export function withFileBatchHelpers<TBase extends Constructor<FileBatchesBase>>(
  Base: TBase,
): (new (...args: any[]) => FileBatchHelpers) & TBase {
  return class extends Base implements FileBatchHelpers {
    async upload(params: FileBatchUploadHelperParams): Promise<StoreFileBatch> {
      if (params.files.length > MAX_FILES) {
        throw new Error(`A batch takes at most ${MAX_FILES} files, got ${params.files.length}`);
      }
      const items = params.files.map((file) => (isItem(file) ? file : { file }));
      const multipartUpload = {
        threshold: MULTIPART_THRESHOLD,
        ...params.multipartUpload,
      };
      const fileIds: string[] = new Array(items.length);
      let next = 0;
      const worker = async () => {
        while (next < items.length) {
          const i = next++;
          const file = await this._client.files.create(
            { file: items[i]!.file, multipartUpload },
            params.options,
          );
          fileIds[i] = file.id;
        }
      };
      await Promise.all(Array.from({ length: Math.max(1, params.maxConcurrency ?? 5) }, worker));

      return this.create(
        params.storeIdentifier,
        {
          files: items.map(({ file: _file, ...fields }, i) => ({
            ...fields,
            file_id: fileIds[i]!,
          })),
        },
        params.options,
      );
    }
  };
}
