// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

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
  ): Core.APIPromise<FileCreateResponse> {
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
  ): Core.APIPromise<FileRetrieveResponse> {
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
  ): Core.APIPromise<FileListResponse>;
  list(vectorStoreId: string, options?: Core.RequestOptions): Core.APIPromise<FileListResponse>;
  list(
    vectorStoreId: string,
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileListResponse> {
    if (isRequestOptions(query)) {
      return this.list(vectorStoreId, {}, query);
    }
    return this._client.get(`/v1/vector_stores/${vectorStoreId}/files`, { query, ...options });
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
}

/**
 * Represents a file stored in a vector store.
 */
export interface FileCreateResponse {
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
   * List of error messages if processing failed
   */
  errors?: Array<string> | null;

  /**
   * Optional file metadata
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * Processing status of the file
   */
  status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

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
export interface FileRetrieveResponse {
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
   * List of error messages if processing failed
   */
  errors?: Array<string> | null;

  /**
   * Optional file metadata
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * Processing status of the file
   */
  status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

  /**
   * Storage usage in bytes
   */
  usage_bytes?: number | null;

  /**
   * Version number of the file
   */
  version?: number | null;
}

export interface FileListResponse {
  /**
   * The list of vector store files
   */
  data: Array<FileListResponse.Data>;

  /**
   * Pagination model that includes total count of items.
   */
  pagination: FileListResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace FileListResponse {
  /**
   * Represents a file stored in a vector store.
   */
  export interface Data {
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
     * List of error messages if processing failed
     */
    errors?: Array<string> | null;

    /**
     * Optional file metadata
     */
    metadata?: unknown | null;

    /**
     * Type of the object
     */
    object?: 'vector_store.file';

    /**
     * Processing status of the file
     */
    status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

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
   * Pagination model that includes total count of items.
   */
  export interface Pagination {
    /**
     * Maximum number of items to return per page
     */
    limit?: number;

    /**
     * Offset of the first item to return
     */
    offset?: number;

    /**
     * Total number of items available
     */
    total?: number;
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

export interface FileCreateParams {
  /**
   * ID of the file to add
   */
  file_id: string;

  /**
   * Optional metadata for the file
   */
  metadata?: unknown | null;
}

export interface FileListParams {
  /**
   * Maximum number of items to return per page
   */
  limit?: number;

  /**
   * Offset of the first item to return
   */
  offset?: number;
}

export declare namespace Files {
  export {
    type FileCreateResponse as FileCreateResponse,
    type FileRetrieveResponse as FileRetrieveResponse,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };
}
