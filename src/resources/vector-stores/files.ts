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
   * Returns: VectorStoreFileResponse: Details of the uploaded and indexed file
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
   * Returns: VectorStoreFileResponse: Details of the vector store file
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

export interface FileCreateResponse {
  id: string;

  /**
   * Timestamp of vector store file creation
   */
  created_at: string;

  vector_store_id: string;

  errors?: Array<string> | null;

  metadata?: unknown | null;

  status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

  usage_bytes?: number | null;

  version?: number | null;
}

export interface FileRetrieveResponse {
  id: string;

  /**
   * Timestamp of vector store file creation
   */
  created_at: string;

  vector_store_id: string;

  errors?: Array<string> | null;

  metadata?: unknown | null;

  status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

  usage_bytes?: number | null;

  version?: number | null;
}

export interface FileListResponse {
  data: Array<FileListResponse.Data>;

  pagination: FileListResponse.Pagination;
}

export namespace FileListResponse {
  export interface Data {
    id: string;

    /**
     * Timestamp of vector store file creation
     */
    created_at: string;

    vector_store_id: string;

    errors?: Array<string> | null;

    metadata?: unknown | null;

    status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

    usage_bytes?: number | null;

    version?: number | null;
  }

  export interface Pagination {
    after?: number;

    limit?: number;

    total?: number;
  }
}

export interface FileDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface FileCreateParams {
  file_id: string;

  metadata: unknown;
}

export interface FileListParams {
  after?: number;

  limit?: number;
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
