// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as StoresAPI from './stores';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import {
  type FileCreateAndPollHelperParams,
  type FilePollHelperParams,
  type FileUploadAndPollHelperParams,
  type FileUploadHelperParams,
  type StoreFileHelpers,
  withStoreFileHelpers,
} from '../../lib/store-files';
export type {
  FilePollHelperParams,
  FileCreateAndPollHelperParams,
  FileUploadHelperParams,
  FileUploadAndPollHelperParams,
  StoreFileHelpers,
};

export class FilesBase extends APIResource {
  /**
   * Upload a file to a store.
   *
   * Args: store_identifier: The ID or name of the store. file_add_params: The file
   * to add to the store.
   *
   * Returns: VectorStoreFile: The uploaded file details.
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
   */
  delete(
    fileIdentifier: string,
    params: FileDeleteParams,
    options?: RequestOptions,
  ): APIPromise<FileDeleteResponse> {
    const { store_identifier } = params;
    return this._client.delete(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, options);
  }
}

export class Files extends withStoreFileHelpers(FilesBase) {}

/**
 * The lifecycle of a unit of background work.
 *
 * One vocabulary for every job family. The database keeps a separate enum type per
 * table (``parsing_job_status``, ``store_file_status``, ...) but they all carry
 * these values, so the aliases below are this enum rather than copies of
 * it. :class:`SyncStatus` is this set plus ``IDLE`` for connectors, which have a
 * resting state between runs.
 */
export type StoreFileStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

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
  chunks?: Array<StoreFile.Chunk> | null;

  /**
   * Presigned URL for file content
   */
  content_url: string;
}

export namespace StoreFile {
  export type Chunk = TextInputChunk | ImageURLInputChunk | AudioURLInputChunk | VideoURLInputChunk;
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
  generated_metadata?: TextInputChunk.GeneratedMetadata | null;

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

  /**
   * summary of the text chunk
   */
  summary?: string | null;
}

export namespace TextInputChunk {
  export type GeneratedMetadata =
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.CsvChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;
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
  generated_metadata?: ImageURLInputChunk.GeneratedMetadata | null;

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
   * LLM-generated context that situates this image within its source document
   */
  context?: string | null;

  /**
   * summary of the image
   */
  summary?: string | null;

  /**
   * Model for image URL validation.
   */
  image_url?: StoresAPI.ImageURLOutput | null;
}

export namespace ImageURLInputChunk {
  export type GeneratedMetadata =
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.CsvChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;
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
  generated_metadata?: AudioURLInputChunk.GeneratedMetadata | null;

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
   * LLM-generated context that situates this audio chunk within its source file
   */
  context?: string | null;

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

export namespace AudioURLInputChunk {
  export type GeneratedMetadata =
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.CsvChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;
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
  generated_metadata?: VideoURLInputChunk.GeneratedMetadata | null;

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
   * LLM-generated context that situates this video chunk within its source file
   */
  context?: string | null;

  /**
   * summary of the video
   */
  summary?: string | null;

  /**
   * Model for video URL validation.
   */
  video_url?: StoresAPI.VideoURL | null;
}

export namespace VideoURLInputChunk {
  export type GeneratedMetadata =
    | StoresAPI.MarkdownChunkGeneratedMetadata
    | StoresAPI.TextChunkGeneratedMetadata
    | StoresAPI.CsvChunkGeneratedMetadata
    | StoresAPI.PdfChunkGeneratedMetadata
    | StoresAPI.CodeChunkGeneratedMetadata
    | StoresAPI.AudioChunkGeneratedMetadata
    | StoresAPI.VideoChunkGeneratedMetadata
    | StoresAPI.ImageChunkGeneratedMetadata
    | null;
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
   * Field to order the files by
   */
  sort_by?: 'created_at' | 'filename' | 'usage_bytes' | 'usage_tokens';

  /**
   * Direction of the sort
   */
  sort_order?: 'asc' | 'desc';

  /**
   * Status to filter by
   */
  statuses?: Array<StoreFileStatus> | null;

  /**
   * Metadata filter to apply to the query
   */
  metadata_filter?: FileListParams.MetadataFilter | null;

  /**
   * Search query for fuzzy matching over name and external_id fields
   */
  q?: string | null;
}

export namespace FileListParams {
  export type MetadataFilterUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type MetadataFilter =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<FileListParams.MetadataFilterUnionMember2>
    | null;
}

export interface FileDeleteParams {
  /**
   * The ID or name of the store
   */
  store_identifier: string;
}

export declare namespace Files {
  export {
    type StoreFileStatus as StoreFileStatus,
    type StoreFile as StoreFile,
    type StoreFileConfig as StoreFileConfig,
    type TextInputChunk as TextInputChunk,
    type ImageURLInputChunk as ImageURLInputChunk,
    type AudioURLInputChunk as AudioURLInputChunk,
    type VideoURLInputChunk as VideoURLInputChunk,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FilePollHelperParams as FilePollHelperParams,
    type FileCreateAndPollHelperParams as FileCreateAndPollHelperParams,
    type FileUploadHelperParams as FileUploadHelperParams,
    type FileUploadAndPollHelperParams as FileUploadAndPollHelperParams,
    type StoreFileHelpers as StoreFileHelpers,
  };
}
