// Hand-written helpers mixed into the generated `files` resource: `create` switches to a
// presigned multipart upload for large files (see upload-file.ts).

import type { FilesBase, FileCreateParams, FileObject } from '../resources/files/files';
import type { RequestOptions } from '../internal/request-options';
import { APIPromise } from '../core/api-promise';
import { handleFileCreate, type MultipartUploadConfig } from './upload-file';

type Constructor<T> = new (...args: any[]) => T;

export interface FileCreateParamsWithMultipart extends FileCreateParams {
  /**
   * Optional configuration for automatic multipart uploads.
   * When the file size exceeds the threshold (default 100MB), the SDK
   * will automatically use multipart upload with presigned URLs.
   */
  multipartUpload?: MultipartUploadConfig;
}

/**
 * Methods `withFileHelpers` adds to (or overrides on) the generated `files` resource.
 *
 * The mixin's return type is spelled out so that declaration emit does not have to name the
 * anonymous class (TS4094: it has the protected `_client` member).
 */
export interface FileHelpers {
  /**
   * Upload a new file. Files larger than the multipart threshold are uploaded in parts.
   */
  create(body: FileCreateParamsWithMultipart, options?: RequestOptions): APIPromise<FileObject>;
}

export function withFileHelpers<TBase extends Constructor<FilesBase>>(
  Base: TBase,
): (new (...args: any[]) => FileHelpers) & TBase {
  return class extends Base implements FileHelpers {
    /**
     * Upload a new file. Files larger than the multipart threshold are uploaded in parts.
     */
    override create(body: FileCreateParamsWithMultipart, options?: RequestOptions): APIPromise<FileObject> {
      return handleFileCreate(this._client, body, options);
    }
  };
}
