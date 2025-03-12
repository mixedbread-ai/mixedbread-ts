// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as Shared from '../shared';
import * as VectorStoresAPI from './vector-stores';
import { LimitOffset, type LimitOffsetParams } from '../../pagination';
import * as polling from '../../lib/polling';
import { Uploadable } from '../../uploads';

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

  /**
   * Poll for a file's processing status until it reaches a terminal state.
   *
   * @param vectorStoreId - The ID of the vector store
   * @param fileId - The ID of the file to poll
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async poll(
    vectorStoreId: string,
    fileId: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: Core.RequestOptions,
  ): Promise<VectorStoreFile> {
    const pollingIntervalMs = pollIntervalMs || 500;
    const pollingTimeoutMs = pollTimeoutMs;

    return polling.poll({
      fn: () => this.retrieve(vectorStoreId, fileId, options),
      condition: (result) =>
        result.status === 'completed' || result.status === 'failed' || result.status === 'error',
      intervalSeconds: pollingIntervalMs / 1000,
      ...(pollingTimeoutMs && { timeoutSeconds: pollingTimeoutMs / 1000 }),
    });
  }

  /**
   * Create a file in a vector store and wait for it to be processed.
   *
   * @param vectorStoreId - The ID of the vector store to upload to
   * @param body - The file creation parameters
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async createAndPoll(
    vectorStoreId: string,
    body: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: Core.RequestOptions,
  ): Promise<VectorStoreFile> {
    const file = await this.create(vectorStoreId, body, options);
    return this.poll(vectorStoreId, file.id, pollIntervalMs, pollTimeoutMs, options);
  }

  /**
   * Upload a file to the files API and then create a file in a vector store.
   * Note the file will be asynchronously processed.
   *
   * @param vectorStoreId - The ID of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param options - Additional request options
   * @returns The created vector store file
   */
  async upload(
    vectorStoreId: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: Core.RequestOptions,
  ): Promise<VectorStoreFile> {
    const fileUploadResponse = await this._client.files.create({ file }, options);

    return this.create(
      vectorStoreId,
      {
        file_id: fileUploadResponse.id,
        ...body,
      },
      options,
    );
  }

  /**
   * Upload a file to files API, create a file in a vector store, and poll until processing is complete.
   *
   * @param vectorStoreId - The ID of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The vector store file object once it reaches a terminal state
   */
  async uploadAndPoll(
    vectorStoreId: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: Core.RequestOptions,
  ): Promise<VectorStoreFile> {
    const vectorStoreFile = await this.upload(vectorStoreId, file, body, options);
    return this.poll(vectorStoreId, vectorStoreFile.id, pollIntervalMs, pollTimeoutMs, options);
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
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Processing status of the file
   */
  status?: string;

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
   * score of the file
   */
  score: number;

  /**
   * chunks
   */
  chunks: Array<VectorStoresAPI.ScoredVectorStoreChunk> | null;
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
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Processing status of the file
   */
  status?: string;

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
   * Search configuration options
   */
  search_options?: VectorStoresAPI.VectorStoreFileSearchOptions;
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
