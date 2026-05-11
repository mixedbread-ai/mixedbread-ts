// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as StoresAPI from './stores';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import * as polling from '../../lib/polling';
import { type MultipartUploadConfig } from '../../lib/upload-file';
import { Uploadable } from '../../uploads';
import { path } from '../../internal/utils/path';

export class Files extends APIResource {
  /**
   * Upload a file to a store.
   *
   * Args: store_identifier: The ID or name of the store. file_add_params: The file
   * to add to the store.
   *
   * Returns: VectorStoreFile: The uploaded file details.
   *
   * @example
   * ```ts
   * const storeFile = await client.stores.files.create(
   *   'store_identifier',
   *   { file_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e' },
   * );
   * ```
   */
  create(storeIdentifier: string, body: FileCreateParams, options?: RequestOptions): APIPromise<StoreFile> {
    return this._client.post(path`/v1/stores/${storeIdentifier}/files`, { body, ...options });
  }

  /**
   * Get a file from a store.
   *
   * Args: store_identifier: The ID or name of the store. file_id: The ID or name of
   * the file. options: Get file options.
   *
   * Returns: VectorStoreFile: The file details.
   *
   * @example
   * ```ts
   * const storeFile = await client.stores.files.retrieve(
   *   'file_identifier',
   *   { store_identifier: 'store_identifier' },
   * );
   * ```
   */
  retrieve(
    fileIdentifier: string,
    params: FileRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<StoreFile> {
    const { store_identifier, ...query } = params;
    return this._client.get(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, {
      query,
      ...options,
    });
  }

  /**
   * Update metadata on a file within a store.
   *
   * Args: store_identifier: The ID or name of the store. file_identifier: The ID or
   * name of the file to update. update_params: Metadata update payload.
   *
   * Returns: StoreFile: The updated file details.
   *
   * @example
   * ```ts
   * const storeFile = await client.stores.files.update(
   *   'file_identifier',
   *   { store_identifier: 'store_identifier' },
   * );
   * ```
   */
  update(fileIdentifier: string, params: FileUpdateParams, options?: RequestOptions): APIPromise<StoreFile> {
    const { store_identifier, ...body } = params;
    return this._client.patch(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, {
      body,
      ...options,
    });
  }

  /**
   * List files indexed in a vector store with pagination and metadata filter.
   *
   * Args: vector_store_identifier: The ID or name of the vector store pagination:
   * Pagination parameters and metadata filter
   *
   * Returns: VectorStoreFileListResponse: Paginated list of vector store files
   *
   * @example
   * ```ts
   * const files = await client.stores.files.list(
   *   'store_identifier',
   * );
   * ```
   */
  list(
    storeIdentifier: string,
    body: FileListParams,
    options?: RequestOptions,
  ): APIPromise<FileListResponse> {
    return this._client.post(path`/v1/stores/${storeIdentifier}/files/list`, { body, ...options });
  }

  /**
   * Delete a file from a store.
   *
   * Args: store_identifier: The ID or name of the store. file_id: The ID or name of
   * the file to delete.
   *
   * Returns: VectorStoreFileDeleted: The deleted file details.
   *
   * @example
   * ```ts
   * const file = await client.stores.files.delete(
   *   'file_identifier',
   *   { store_identifier: 'store_identifier' },
   * );
   * ```
   */
  delete(
    fileIdentifier: string,
    params: FileDeleteParams,
    options?: RequestOptions,
  ): APIPromise<FileDeleteResponse> {
    const { store_identifier } = params;
    return this._client.delete(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, options);
  }

  /**
   * Poll for a file's processing status until it reaches a terminal state.
   *
   * Supports both positional arguments (`poll(storeIdentifier, fileIdentifier, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`poll({ storeIdentifier, fileIdentifier, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store when using positional arguments
   * @param fileIdentifier - The ID or external identifier of the file to poll when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Poll configuration when using named parameters
   * @returns The file object once it reaches a terminal state
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
      condition: (result) =>
        result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled',
      intervalSeconds: pollingIntervalMs / 1000,
      ...(params.pollTimeoutMs && { timeoutSeconds: params.pollTimeoutMs / 1000 }),
    });
  }

  /**
   * Create a file in a vector store and wait for it to be processed.
   *
   * Supports both positional arguments (`createAndPoll(storeIdentifier, body, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`createAndPoll({ storeIdentifier, body, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store to upload to when using positional arguments
   * @param body - The file creation parameters when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Create configuration when using named parameters
   * @returns The file object once it reaches a terminal state
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
   * Upload a file to the files API and then create a file in a vector store.
   * Note the file will be asynchronously processed.
   *
   * Supports both positional arguments (`upload(storeIdentifier, file, body, options)`) and a named-parameter object
   * (`upload({ storeIdentifier, file, body, options })`).
   *
   * @param storeIdentifier - The identifier of the store to add the file to when using positional arguments
   * @param file - The file to upload when using positional arguments
   * @param body - Additional parameters for the vector store file when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Upload configuration when using named parameters
   * @returns The created vector store file
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
   * Upload a file to files API, create a file in a vector store, and poll until processing is complete.
   *
   * Supports both positional arguments (`uploadAndPoll(storeIdentifier, file, body, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`uploadAndPoll({ storeIdentifier, file, body, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store to add the file to when using positional arguments
   * @param file - The file to upload when using positional arguments
   * @param body - Additional parameters for the vector store file when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Upload and poll configuration when using named parameters
   * @returns The vector store file object once it reaches a terminal state
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

    const vectorStoreFile = await this.upload({
      storeIdentifier: params.storeIdentifier,
      file: params.file,
      body: params.body,
      options: params.options,
      multipartUpload: params.multipartUpload,
    });

    return this.poll({
      storeIdentifier: params.storeIdentifier,
      fileIdentifier: vectorStoreFile.id,
      pollIntervalMs: params.pollIntervalMs,
      pollTimeoutMs: params.pollTimeoutMs,
      options: params.options,
      returnChunks: params.returnChunks,
    });
  }
}

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

export interface AudioURLInputChunk {
  /**
   * position of the chunk in a file
   */
  chunk_index: number;

  /**
   * mime type of the chunk
   */
  mime_type?: string;

  /**
   * metadata of the chunk
   */
  generated_metadata?:
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;

  /**
   * model used for this chunk
   */
  model?: string | null;

  /**
   * Input type identifier
   */
  type?: 'audio_url';

  /**
   * speech recognition (sr) text of the audio
   */
  transcription?: string | null;

  /**
   * summary of the audio
   */
  summary?: string | null;

  /**
   * Model for audio URL validation.
   */
  audio_url?: StoresAPI.AudioURL | null;

  /**
   * The sampling rate of the audio.
   */
  sampling_rate: number;
}

export interface ImageURLInputChunk {
  /**
   * position of the chunk in a file
   */
  chunk_index: number;

  /**
   * mime type of the chunk
   */
  mime_type?: string;

  /**
   * metadata of the chunk
   */
  generated_metadata?:
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;

  /**
   * model used for this chunk
   */
  model?: string | null;

  /**
   * Input type identifier
   */
  type?: 'image_url';

  /**
   * ocr text of the image
   */
  ocr_text?: string | null;

  /**
   * summary of the image
   */
  summary?: string | null;

  /**
   * Model for image URL validation.
   */
  image_url?: StoresAPI.ImageURLOutput | null;
}

/**
 * Represents a file stored in a store.
 */
export interface StoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Name of the file
   */
  filename?: string;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * External identifier for this file in the store
   */
  external_id?: string | null;

  /**
   * Processing status of the file
   */
  status?: StoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing store
   */
  store_id: string;

  /**
   * Timestamp of store file creation
   */
  created_at: string;

  /**
   * Version number of the file
   */
  version?: number | null;

  /**
   * Storage usage in bytes
   */
  usage_bytes?: number | null;

  /**
   * Storage usage in tokens
   */
  usage_tokens?: number | null;

  /**
   * Configuration for a file.
   */
  config?: StoreFileConfig | null;

  /**
   * Type of the object
   */
  object?: 'store.file';

  /**
   * chunks
   */
  chunks?: Array<TextInputChunk | ImageURLInputChunk | AudioURLInputChunk | VideoURLInputChunk> | null;

  /**
   * Presigned URL for file content
   */
  content_url: string;
}

/**
 * Configuration for a file.
 */
export interface StoreFileConfig {
  /**
   * Strategy for adding the file, this overrides the store-level default
   */
  parsing_strategy?: 'fast' | 'high_quality';
}

export type StoreFileStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

export interface TextInputChunk {
  /**
   * position of the chunk in a file
   */
  chunk_index: number;

  /**
   * mime type of the chunk
   */
  mime_type?: string;

  /**
   * metadata of the chunk
   */
  generated_metadata?:
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;

  /**
   * model used for this chunk
   */
  model?: string | null;

  /**
   * Input type identifier
   */
  type?: 'text';

  /**
   * The offset of the text in the file relative to the start of the file.
   */
  offset?: number;

  /**
   * Text content
   */
  text?: string | null;

  /**
   * LLM-generated context that situates this chunk within its source document
   */
  context?: string | null;
}

export interface VideoURLInputChunk {
  /**
   * position of the chunk in a file
   */
  chunk_index: number;

  /**
   * mime type of the chunk
   */
  mime_type?: string;

  /**
   * metadata of the chunk
   */
  generated_metadata?:
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;

  /**
   * model used for this chunk
   */
  model?: string | null;

  /**
   * Input type identifier
   */
  type?: 'video_url';

  /**
   * speech recognition (sr) text of the video
   */
  transcription?: string | null;

  /**
   * summary of the video
   */
  summary?: string | null;

  /**
   * Model for video URL validation.
   */
  video_url?: StoresAPI.VideoURL | null;
}

export interface FileListResponse {
  /**
   * Response model for cursor-based pagination.
   */
  pagination: FileListResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of store files
   */
  data: Array<StoreFile>;
}

export namespace FileListResponse {
  /**
   * Response model for cursor-based pagination.
   */
  export interface Pagination {
    /**
     * Contextual direction-aware flag: True if more items exist in the requested
     * pagination direction. For 'after': more items after this page. For 'before':
     * more items before this page.
     */
    has_more: boolean;

    /**
     * Cursor of the first item in this page. Use for backward pagination. None if page
     * is empty.
     */
    first_cursor: string | null;

    /**
     * Cursor of the last item in this page. Use for forward pagination. None if page
     * is empty.
     */
    last_cursor: string | null;

    /**
     * Total number of items available across all pages. Only included when
     * include_total=true was requested. Expensive operation - use sparingly.
     */
    total?: number | null;
  }
}

/**
 * Response model for file deletion.
 */
export interface FileDeleteResponse {
  /**
   * ID of the deleted file
   */
  id: string;

  /**
   * Whether the deletion was successful
   */
  deleted?: boolean;

  /**
   * Type of the deleted object
   */
  object?: 'store.file';
}

export interface FileCreateParams {
  /**
   * Optional metadata for the file
   */
  metadata?: unknown;

  /**
   * Configuration for adding the file
   */
  config?: StoreFileConfig;

  /**
   * External identifier for this file in the store
   */
  external_id?: string | null;

  /**
   * If true, overwrite an existing file with the same external_id
   */
  overwrite?: boolean;

  /**
   * ID of the file to add
   */
  file_id: string;

  /**
   * Configuration for a file.
   */
  experimental?: StoreFileConfig | null;
}

export interface FileRetrieveParams {
  /**
   * Path param: The ID or name of the store
   */
  store_identifier: string;

  /**
   * Query param: Whether to return the chunks for the file. If a list of integers is
   * provided, only the chunks at the specified indices will be returned.
   */
  return_chunks?: boolean | Array<number>;
}

export interface FileUpdateParams {
  /**
   * Path param: The ID or name of the store
   */
  store_identifier: string;

  /**
   * Body param: Updated metadata for the file
   */
  metadata?: { [key: string]: unknown } | null;
}

export interface FileListParams {
  /**
   * Maximum number of items to return per page (1-100)
   */
  limit?: number;

  /**
   * Cursor for forward pagination - get items after this position. Use last_cursor
   * from previous response.
   */
  after?: string | null;

  /**
   * Cursor for backward pagination - get items before this position. Use
   * first_cursor from previous response.
   */
  before?: string | null;

  /**
   * Whether to include total count in response (expensive operation)
   */
  include_total?: boolean;

  /**
   * Status to filter by
   */
  statuses?: Array<StoreFileStatus> | null;

  /**
   * Metadata filter to apply to the query
   */
  metadata_filter?:
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
    | null;

  /**
   * Search query for fuzzy matching over name and external_id fields
   */
  q?: string | null;
}

export interface FileDeleteParams {
  /**
   * The ID or name of the store
   */
  store_identifier: string;
}

export declare namespace Files {
  export {
    type AudioURLInputChunk as AudioURLInputChunk,
    type ImageURLInputChunk as ImageURLInputChunk,
    type StoreFile as StoreFile,
    type StoreFileConfig as StoreFileConfig,
    type StoreFileStatus as StoreFileStatus,
    type TextInputChunk as TextInputChunk,
    type VideoURLInputChunk as VideoURLInputChunk,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
  };
}
