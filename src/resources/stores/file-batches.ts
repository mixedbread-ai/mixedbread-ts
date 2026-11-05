// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FilesAPI from './files';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import {
  type FileBatchHelpers,
  type FileBatchUploadHelperParams,
  type FileBatchUploadItem,
  withFileBatchHelpers,
} from '../../lib/file-batches';
export type { FileBatchUploadItem, FileBatchUploadHelperParams, FileBatchHelpers };

export class FileBatchesBase extends APIResource {
  /**
   * Add already uploaded files to a store in one call, for backfills.
   *
   * Each item takes one token from a rate limit of its own, at the same limits as
   * file uploads. A batch never replaces a file: one already in the store (same file
   * ID or external ID), in any status, comes back with
   * `store_file_already_exists_error`. To retry a failed file, delete it first; to
   * update a file, use the single-file endpoint. Each item is checked on its own:
   * one rejected item is reported in `data` without failing the others.
   */
  create(
    storeIdentifier: string,
    body: FileBatchCreateParams,
    options?: RequestOptions,
  ): APIPromise<StoreFileBatch> {
    return this._client.post(path`/v1/stores/${storeIdentifier}/file_batches`, { body, ...options });
  }
}

export class FileBatches extends withFileBatchHelpers(FileBatchesBase) {}

/**
 * Outcome of adding a batch of files to a store.
 */
export interface StoreFileBatch {
  /**
   * Outcome of each item, in request order
   */
  data: Array<StoreFileBatch.Data>;

  /**
   * Type of the object
   */
  object?: 'store.file_batch';
}

export namespace StoreFileBatch {
  /**
   * Outcome of each item, in request order
   */
  export interface Data {
    /**
     * ID of the file the item named
     */
    file_id: string;

    /**
     * External identifier the item named
     */
    external_id?: string | null;

    /**
     * The lifecycle of a unit of background work.
     *
     * One vocabulary for every job family. The database keeps a separate enum type per
     * table (``parsing_job_status``, ``store_file_status``, ...) but they all carry
     * these values, so the aliases below are this enum rather than copies of
     * it. :class:`SyncStatus` is this set plus ``IDLE`` for connectors, which have a
     * resting state between runs.
     */
    status?: FilesAPI.StoreFileStatus | null;

    /**
     * Why an item was not added, with the error code the single-file endpoint returns.
     */
    error?: StoreFileBatch.DataError | null;
  }

  /**
   * Why an item was not added, with the error code the single-file endpoint returns.
   */
  export interface DataError {
    /**
     * Error code
     */
    code: string;

    /**
     * Error message
     */
    message: string;
  }
}

export interface FileBatchCreateParams {
  /**
   * Files to add
   */
  files: Array<FileBatchCreateParams.File>;
}

export namespace FileBatchCreateParams {
  /**
   * Files to add
   */
  export interface File {
    /**
     * ID of the file to add
     */
    file_id: string;

    /**
     * External identifier for this file in the store
     */
    external_id?: string | null;

    /**
     * Optional metadata for the file
     */
    metadata?: unknown;

    /**
     * Configuration for adding the file
     */
    config?: FilesAPI.StoreFileConfig;
  }
}

export declare namespace FileBatches {
  export {
    type StoreFileBatch as StoreFileBatch,
    type FileBatchCreateParams as FileBatchCreateParams,
    type FileBatchUploadItem as FileBatchUploadItem,
    type FileBatchUploadHelperParams as FileBatchUploadHelperParams,
    type FileBatchHelpers as FileBatchHelpers,
  };
}
