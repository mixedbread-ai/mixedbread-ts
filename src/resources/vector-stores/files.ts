// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FilesAPI from './files';
import * as Shared from '../shared';
import * as VectorStoresAPI from './vector-stores';
import { APIPromise } from '../../core/api-promise';
import { Cursor, type CursorParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Files extends APIResource {
  /**
   * Upload a new file to a vector store for indexing.
   *
   * Args: vector_store_identifier: The ID or name of the vector store to upload to
   * file: The file to upload and index
   *
   * Returns: VectorStoreFile: Details of the uploaded and indexed file
   */
  create(
    vectorStoreIdentifier: string,
    body: FileCreateParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreFile> {
    return this._client.post(path`/v1/vector_stores/${vectorStoreIdentifier}/files`, { body, ...options });
  }

  /**
   * Get details of a specific file in a vector store.
   *
   * Args: vector_store_identifier: The ID or name of the vector store file_id: The
   * ID of the file
   *
   * Returns: VectorStoreFile: Details of the vector store file
   */
  retrieve(
    fileID: string,
    params: FileRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreFile> {
    const { vector_store_identifier, ...query } = params;
    return this._client.get(path`/v1/vector_stores/${vector_store_identifier}/files/${fileID}`, {
      query,
      ...options,
    });
  }

  /**
   * List files indexed in a vector store with pagination.
   *
   * Args: vector_store_identifier: The ID or name of the vector store pagination:
   * Pagination parameters
   *
   * Returns: VectorStoreFileListResponse: Paginated list of vector store files
   */
  list(
    vectorStoreIdentifier: string,
    query: FileListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<VectorStoreFilesCursor, VectorStoreFile> {
    return this._client.getAPIList(
      path`/v1/vector_stores/${vectorStoreIdentifier}/files`,
      Cursor<VectorStoreFile>,
      { query, ...options },
    );
  }

  /**
   * Delete a file from a vector store.
   *
   * Args: vector_store_identifier: The ID or name of the vector store file_id: The
   * ID of the file to delete
   *
   * Returns: VectorStoreFileDeleted: The deleted file
   */
  delete(fileID: string, params: FileDeleteParams, options?: RequestOptions): APIPromise<FileDeleteResponse> {
    const { vector_store_identifier } = params;
    return this._client.delete(path`/v1/vector_stores/${vector_store_identifier}/files/${fileID}`, options);
  }

  /**
   * Perform semantic search across complete vector store files.
   *
   * This endpoint searches through vector store files using semantic similarity
   * matching. Unlike chunk search, it returns complete matching files rather than
   * individual chunks. Supports complex search queries with filters and returns
   * relevance-scored results.
   *
   * Args: search_params: Search configuration including: - query text or
   * embeddings - metadata filters - pagination parameters - sorting preferences
   * \_state: API state dependency \_ctx: Service context dependency
   *
   * Returns: VectorStoreSearchFileResponse containing: - List of matched files with
   * relevance scores - Pagination details including total result count
   *
   * Raises: HTTPException (400): If search parameters are invalid HTTPException
   * (404): If no vector stores are found to search
   */
  search(body: FileSearchParams, options?: RequestOptions): APIPromise<FileSearchResponse> {
    return this._client.post('/v1/vector_stores/files/search', { body, ...options });
  }
}

export type VectorStoreFilesCursor = Cursor<VectorStoreFile>;

/**
 * Represents a reranking configuration.
 */
export interface RerankConfig {
  /**
   * The name of the reranking model
   */
  model?: string;

  /**
   * Whether to include metadata in the reranked results
   */
  with_metadata?: boolean | Array<string>;

  /**
   * Maximum number of results to return after reranking. If None, returns all
   * reranked results.
   */
  top_k?: number | null;
}

/**
 * Represents a scored file stored in a vector store.
 */
export interface ScoredVectorStoreFile {
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
   * Processing status of the file
   */
  status?: VectorStoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Timestamp of vector store file creation
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
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * chunks
   */
  chunks: Array<
    | VectorStoresAPI.ScoredTextInputChunk
    | VectorStoresAPI.ScoredImageURLInputChunk
    | VectorStoresAPI.ScoredAudioURLInputChunk
    | VectorStoresAPI.ScoredVideoURLInputChunk
  > | null;

  /**
   * score of the file
   */
  score: number;
}

export type VectorStoreFileStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

/**
 * Represents a file stored in a vector store.
 */
export interface VectorStoreFile {
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
   * Processing status of the file
   */
  status?: VectorStoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Timestamp of vector store file creation
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
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * chunks
   */
  chunks?: Array<
    | VectorStoreFile.TextInputChunk
    | VectorStoreFile.ImageURLInputChunkBase
    | VectorStoreFile.AudioURLInputChunkBase
    | VectorStoreFile.VideoURLInputChunkBase
  > | null;
}

export namespace VectorStoreFile {
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
    generated_metadata?: { [key: string]: unknown } | null;

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
     * Text content to process
     */
    text: string;
  }

  export interface ImageURLInputChunkBase {
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
    generated_metadata?: { [key: string]: unknown } | null;

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
  }

  export interface AudioURLInputChunkBase {
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
    generated_metadata?: { [key: string]: unknown } | null;

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
  }

  export interface VideoURLInputChunkBase {
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
    generated_metadata?: { [key: string]: unknown } | null;

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
  object?: 'vector_store.file';
}

export interface FileSearchResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of scored vector store files
   */
  data: Array<ScoredVectorStoreFile>;
}

export interface FileCreateParams {
  /**
   * ID of the file to add
   */
  file_id: string;

  /**
   * Optional metadata for the file
   */
  metadata?: unknown;

  /**
   * Strategy for adding the file
   */
  experimental?: FileCreateParams.Experimental;
}

export namespace FileCreateParams {
  /**
   * Strategy for adding the file
   */
  export interface Experimental {
    /**
     * Strategy for adding the file
     */
    parsing_strategy?: 'fast' | 'high_quality';

    /**
     * Whether to contextualize the file
     */
    contextualization?: boolean;
  }
}

export interface FileRetrieveParams {
  /**
   * Path param: The ID or name of the vector store
   */
  vector_store_identifier: string;

  /**
   * Query param: Whether to return the chunks for the file
   */
  return_chunks?: boolean;
}

export interface FileListParams extends CursorParams {
  /**
   * Status to filter by
   */
  statuses?: Array<VectorStoreFileStatus> | null;
}

export interface FileDeleteParams {
  /**
   * The ID or name of the vector store
   */
  vector_store_identifier: string;
}

export interface FileSearchParams {
  /**
   * Search query text
   */
  query: string;

  /**
   * IDs or names of vector stores to search
   */
  vector_store_identifiers?: Array<string> | null;

  /**
   * @deprecated
   */
  vector_store_ids?: Array<string> | null;

  /**
   * Number of results to return
   */
  top_k?: number;

  /**
   * Optional filter conditions
   */
  filters?:
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Search configuration options
   */
  search_options?: FileSearchParams.SearchOptions;
}

export namespace FileSearchParams {
  /**
   * Search configuration options
   */
  export interface SearchOptions {
    /**
     * Minimum similarity score threshold
     */
    score_threshold?: number;

    /**
     * Whether to rewrite the query
     */
    rewrite_query?: boolean;

    /**
     * Whether to rerank results and optional reranking configuration
     */
    rerank?: boolean | FilesAPI.RerankConfig | null;

    /**
     * Whether to return file metadata
     */
    return_metadata?: boolean;

    /**
     * Whether to return matching text chunks
     */
    return_chunks?: boolean;

    /**
     * Number of chunks to return for each file
     */
    chunks_per_file?: number;

    /**
     * Whether to apply search rules
     */
    apply_search_rules?: boolean;
  }
}

export declare namespace Files {
  export {
    type RerankConfig as RerankConfig,
    type ScoredVectorStoreFile as ScoredVectorStoreFile,
    type VectorStoreFileStatus as VectorStoreFileStatus,
    type VectorStoreFile as VectorStoreFile,
    type FileDeleteResponse as FileDeleteResponse,
    type FileSearchResponse as FileSearchResponse,
    type VectorStoreFilesCursor as VectorStoreFilesCursor,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileSearchParams as FileSearchParams,
  };
}
