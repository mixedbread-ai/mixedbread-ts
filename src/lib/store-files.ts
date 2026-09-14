// Hand-written helpers mixed into the generated `stores.files` resource.
//
// The generator emits `FilesBase` with the API methods and declares
// `export class Files extends withStoreFileHelpers(FilesBase) {}`, so everything defined here is
// part of `client.stores.files` and can call the generated methods through `this`.

import type { FilesBase, FileCreateParams, FileRetrieveParams, StoreFile } from '../resources/stores/files';
import type { RequestOptions } from '../internal/request-options';
import type { Uploadable } from '../core/uploads';
import * as polling from './polling';
import { type MultipartUploadConfig } from './upload-file';

const TERMINAL = ['completed', 'failed', 'cancelled'];

/**
 * Parameters for polling store file status.
 */
export interface FilePollHelperParams {
  storeIdentifier: string;
  fileIdentifier: string;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
}

/**
 * Parameters for creating and polling a store file.
 */
export interface FileCreateAndPollHelperParams {
  storeIdentifier: string;
  body: FileCreateParams;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
}

/**
 * Parameters for uploading a file to a store.
 */
export interface FileUploadHelperParams {
  storeIdentifier: string;
  file: Uploadable;
  body?: Omit<FileCreateParams, 'file_id'> | undefined;
  options?: RequestOptions | undefined;
  multipartUpload?: MultipartUploadConfig | undefined;
}

/**
 * Parameters for uploading and polling a store file.
 */
export interface FileUploadAndPollHelperParams {
  storeIdentifier: string;
  file: Uploadable;
  body?: Omit<FileCreateParams, 'file_id'> | undefined;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
  multipartUpload?: MultipartUploadConfig | undefined;
}

type Constructor<T> = new (...args: any[]) => T;

/**
 * Methods `withStoreFileHelpers` adds to the generated `stores.files` resource.
 *
 * The mixin's return type is spelled out so that declaration emit does not have to name the
 * anonymous class (TS4094: it has the protected `_client` member).
 */
export interface StoreFileHelpers {
  /**
   * Poll for a file's processing status until it reaches a terminal state.
   */
  poll(
    storeIdentifier: string,
    fileIdentifier: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  poll(params: FilePollHelperParams): Promise<StoreFile>;

  /**
   * Create a file in a store and wait for it to be processed.
   */
  createAndPoll(
    storeIdentifier: string,
    body: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  createAndPoll(params: FileCreateAndPollHelperParams): Promise<StoreFile>;

  /**
   * Upload a file to the files API and then create a file in a store.
   * Note the file will be asynchronously processed.
   */
  upload(
    storeIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: RequestOptions,
    multipartUpload?: MultipartUploadConfig,
  ): Promise<StoreFile>;
  upload(params: FileUploadHelperParams): Promise<StoreFile>;

  /**
   * Upload a file to the files API, create a file in a store, and poll until processing is complete.
   */
  uploadAndPoll(
    storeIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
    multipartUpload?: MultipartUploadConfig,
  ): Promise<StoreFile>;
  uploadAndPoll(params: FileUploadAndPollHelperParams): Promise<StoreFile>;
}

export function withStoreFileHelpers<TBase extends Constructor<FilesBase>>(
  Base: TBase,
): (new (...args: any[]) => StoreFileHelpers) & TBase {
  return class extends Base implements StoreFileHelpers {
    /**
     * Poll for a file's processing status until it reaches a terminal state.
     *
     * Supports positional arguments (`poll(storeIdentifier, fileIdentifier, pollIntervalMs, pollTimeoutMs, options)`)
     * and a named-parameter object (`poll({ storeIdentifier, fileIdentifier, ... })`).
     */
    async poll(
      storeIdentifier: string,
      fileIdentifier: string,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<StoreFile>;
    async poll(params: FilePollHelperParams): Promise<StoreFile>;
    async poll(
      storeIdentifierOrParams: string | FilePollHelperParams,
      fileIdentifier?: string,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<StoreFile> {
      const params: FilePollHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          {
            storeIdentifier: storeIdentifierOrParams,
            fileIdentifier: fileIdentifier as string,
            pollIntervalMs,
            pollTimeoutMs,
            options,
          }
        : storeIdentifierOrParams;

      const pollingIntervalMs = params.pollIntervalMs ?? 500;
      const retrieveParams: FileRetrieveParams = {
        store_identifier: params.storeIdentifier,
        ...(params.returnChunks !== undefined && { return_chunks: params.returnChunks }),
      };

      return polling.poll({
        fn: () => this.retrieve(params.fileIdentifier, retrieveParams, params.options),
        condition: (result) => TERMINAL.includes(result.status ?? ''),
        intervalSeconds: pollingIntervalMs / 1000,
        ...(params.pollTimeoutMs && { timeoutSeconds: params.pollTimeoutMs / 1000 }),
      });
    }

    /**
     * Create a file in a store and wait for it to be processed.
     */
    async createAndPoll(
      storeIdentifier: string,
      body: FileCreateParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<StoreFile>;
    async createAndPoll(params: FileCreateAndPollHelperParams): Promise<StoreFile>;
    async createAndPoll(
      storeIdentifierOrParams: string | FileCreateAndPollHelperParams,
      body?: FileCreateParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<StoreFile> {
      const params: FileCreateAndPollHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          {
            storeIdentifier: storeIdentifierOrParams,
            body: body as FileCreateParams,
            pollIntervalMs,
            pollTimeoutMs,
            options,
          }
        : storeIdentifierOrParams;

      const file = await this.create(params.storeIdentifier, params.body, params.options);
      return this.poll({
        storeIdentifier: params.storeIdentifier,
        fileIdentifier: file.id,
        pollIntervalMs: params.pollIntervalMs,
        pollTimeoutMs: params.pollTimeoutMs,
        options: params.options,
        returnChunks: params.returnChunks,
      });
    }

    /**
     * Upload a file to the files API and then create a file in a store.
     * Note the file will be asynchronously processed.
     */
    async upload(
      storeIdentifier: string,
      file: Uploadable,
      body?: Omit<FileCreateParams, 'file_id'>,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<StoreFile>;
    async upload(params: FileUploadHelperParams): Promise<StoreFile>;
    async upload(
      storeIdentifierOrParams: string | FileUploadHelperParams,
      file?: Uploadable,
      body?: Omit<FileCreateParams, 'file_id'>,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<StoreFile> {
      const params: FileUploadHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          {
            storeIdentifier: storeIdentifierOrParams,
            file: file as Uploadable,
            body,
            options,
            multipartUpload,
          }
        : storeIdentifierOrParams;

      const fileUploadResponse = await this._client.files.create(
        {
          file: params.file,
          ...(params.multipartUpload && { multipartUpload: params.multipartUpload }),
        },
        params.options,
      );

      return this.create(
        params.storeIdentifier,
        { file_id: fileUploadResponse.id, ...params.body },
        params.options,
      );
    }

    /**
     * Upload a file to the files API, create a file in a store, and poll until processing is complete.
     */
    async uploadAndPoll(
      storeIdentifier: string,
      file: Uploadable,
      body?: Omit<FileCreateParams, 'file_id'>,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<StoreFile>;
    async uploadAndPoll(params: FileUploadAndPollHelperParams): Promise<StoreFile>;
    async uploadAndPoll(
      storeIdentifierOrParams: string | FileUploadAndPollHelperParams,
      file?: Uploadable,
      body?: Omit<FileCreateParams, 'file_id'>,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<StoreFile> {
      const params: FileUploadAndPollHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          {
            storeIdentifier: storeIdentifierOrParams,
            file: file as Uploadable,
            body,
            pollIntervalMs,
            pollTimeoutMs,
            options,
            multipartUpload,
          }
        : storeIdentifierOrParams;

      const storeFile = await this.upload({
        storeIdentifier: params.storeIdentifier,
        file: params.file,
        body: params.body,
        options: params.options,
        multipartUpload: params.multipartUpload,
      });

      return this.poll({
        storeIdentifier: params.storeIdentifier,
        fileIdentifier: storeFile.id,
        pollIntervalMs: params.pollIntervalMs,
        pollTimeoutMs: params.pollTimeoutMs,
        options: params.options,
        returnChunks: params.returnChunks,
      });
    }
  };
}
