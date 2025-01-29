// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as Shared from '../shared';
import * as VectorStoresAPI from './vector-stores';
import { LimitOffset, type LimitOffsetParams } from '../../pagination';

export class Files extends APIResource {
  /**
   * Upload a new file to a vector store for indexing.
   *
   * Args: vector_store_id: The ID of the vector store to upload to file: The file to
   * upload and index
   *
   * Returns: VectorStoreFile: Details of the uploaded and indexed file
   */
  create(
    vectorStoreId: string,
    body: FileCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreFile> {
    return this._client.post(`/v1/vector_stores/${vectorStoreId}/files`, { body, ...options });
  }

  /**
   * Get details of a specific file in a vector store.
   *
   * Args: vector_store_id: The ID of the vector store file_id: The ID of the file
   *
   * Returns: VectorStoreFile: Details of the vector store file
   */
  retrieve(
    vectorStoreId: string,
    fileId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreFile> {
    return this._client.get(`/v1/vector_stores/${vectorStoreId}/files/${fileId}`, options);
  }

  /**
   * List files indexed in a vector store with pagination.
   *
   * Args: vector_store_id: The ID of the vector store pagination: Pagination
   * parameters
   *
   * Returns: VectorStoreFileListResponse: Paginated list of vector store files
   */
  list(
    vectorStoreId: string,
    query?: FileListParams,
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoreFilesLimitOffset, VectorStoreFile>;
  list(
    vectorStoreId: string,
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoreFilesLimitOffset, VectorStoreFile>;
  list(
    vectorStoreId: string,
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoreFilesLimitOffset, VectorStoreFile> {
    if (isRequestOptions(query)) {
      return this.list(vectorStoreId, {}, query);
    }
    return this._client.getAPIList(`/v1/vector_stores/${vectorStoreId}/files`, VectorStoreFilesLimitOffset, {
      query,
      ...options,
    });
  }

  /**
   * Delete a file from a vector store.
   *
   * Args: vector_store_id: The ID of the vector store file_id: The ID of the file to
   * delete
   *
   * Returns: VectorStoreFileDeleted: The deleted file
   */
  delete(
    vectorStoreId: string,
    fileId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileDeleteResponse> {
    return this._client.delete(`/v1/vector_stores/${vectorStoreId}/files/${fileId}`, options);
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
  search(body: FileSearchParams, options?: Core.RequestOptions): Core.APIPromise<FileSearchResponse> {
    return this._client.post('/v1/vector_stores/files/search', { body, ...options });
  }
}

export class VectorStoreFilesLimitOffset extends LimitOffset<VectorStoreFile> {}

/**
 * Represents a scored file stored in a vector store.
 */
export interface ScoredVectorStoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * chunks
   */
  chunks: Array<VectorStoresAPI.ScoredVectorStoreChunk>;

  /**
   * Timestamp of vector store file creation
   */
  created_at: string;

  /**
   * score of the file
   */
  score: number;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * Processing status of the file
   */
  status?: string;

  /**
   * Storage usage in bytes
   */
  usage_bytes?: number | null;

  /**
   * Version number of the file
   */
  version?: number | null;
}

/**
 * Represents a file stored in a vector store.
 */
export interface VectorStoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Timestamp of vector store file creation
   */
  created_at: string;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * Processing status of the file
   */
  status?: string;

  /**
   * Storage usage in bytes
   */
  usage_bytes?: number | null;

  /**
   * Version number of the file
   */
  version?: number | null;
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
   * The list of scored vector store files
   */
  data: Array<ScoredVectorStoreFile>;

  /**
   * The object type of the response
   */
  object?: 'list';
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
}

export interface FileListParams extends LimitOffsetParams {}

export interface FileSearchParams {
  /**
   * Search query text
   */
  query: string;

  /**
   * IDs of vector stores to search
   */
  vector_store_ids: Array<string>;

  /**
   * Optional filter conditions
   */
  filters?:
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
    | null;

  /**
   * Search configuration options
   */
  search_options?: VectorStoresAPI.VectorStoreSearchOptions;

  /**
   * Number of results to return
   */
  top_k?: number;
}

Files.VectorStoreFilesLimitOffset = VectorStoreFilesLimitOffset;

export declare namespace Files {
  export {
    type ScoredVectorStoreFile as ScoredVectorStoreFile,
    type VectorStoreFile as VectorStoreFile,
    type FileDeleteResponse as FileDeleteResponse,
    type FileSearchResponse as FileSearchResponse,
    VectorStoreFilesLimitOffset as VectorStoreFilesLimitOffset,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
    type FileSearchParams as FileSearchParams,
  };
}
