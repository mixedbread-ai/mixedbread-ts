// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileDeleteResponse,
  FileListParams,
  Files,
  VectorStoreFile,
  VectorStoreFilesLimitOffset,
} from './files';
import { LimitOffset, type LimitOffsetParams } from '../../pagination';

export class VectorStores extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);

  /**
   * Create a new vector store.
   *
   * Args: vector_store_create: VectorStoreCreate object containing the name,
   * description, and metadata.
   *
   * Returns: VectorStore: The response containing the created vector store details.
   */
  create(body: VectorStoreCreateParams, options?: Core.RequestOptions): Core.APIPromise<VectorStore> {
    return this._client.post('/v1/vector_stores', { body, ...options });
  }

  /**
   * Get a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to retrieve.
   *
   * Returns: VectorStore: The response containing the vector store details.
   */
  retrieve(vectorStoreId: string, options?: Core.RequestOptions): Core.APIPromise<VectorStore> {
    return this._client.get(`/v1/vector_stores/${vectorStoreId}`, options);
  }

  /**
   * Update a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to update.
   * vector_store_update: VectorStoreCreate object containing the name, description,
   * and metadata.
   *
   * Returns: VectorStore: The response containing the updated vector store details.
   */
  update(
    vectorStoreId: string,
    body: VectorStoreUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStore> {
    return this._client.put(`/v1/vector_stores/${vectorStoreId}`, { body, ...options });
  }

  /**
   * List all vector stores.
   *
   * Args: pagination: The pagination options.
   *
   * Returns: VectorStoreListResponse: The list of vector stores.
   */
  list(
    query?: VectorStoreListParams,
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoresLimitOffset, VectorStore>;
  list(options?: Core.RequestOptions): Core.PagePromise<VectorStoresLimitOffset, VectorStore>;
  list(
    query: VectorStoreListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoresLimitOffset, VectorStore> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList('/v1/vector_stores', VectorStoresLimitOffset, { query, ...options });
  }

  /**
   * Delete a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to delete.
   *
   * Returns: VectorStore: The response containing the deleted vector store details.
   */
  delete(vectorStoreId: string, options?: Core.RequestOptions): Core.APIPromise<VectorStoreDeleteResponse> {
    return this._client.delete(`/v1/vector_stores/${vectorStoreId}`, options);
  }

  /**
   * Perform a search based on the provided query.
   *
   * Args: search_params: VectorStoreSearchParams object containing the search
   * parameters.
   *
   * Returns: VectorStoreSearchResponse: The response containing the search results
   * and pagination details.
   */
  search(
    body: VectorStoreSearchParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreSearchResponse> {
    return this._client.post('/v1/vector_stores/search', { body, ...options });
  }
}

export class VectorStoresLimitOffset extends LimitOffset<VectorStore> {}

/**
 * Represents an expiration policy for a vector store.
 */
export interface ExpiresAfter {
  /**
   * Anchor date for the expiration policy
   */
  anchor?: 'last_used_at';

  /**
   * Number of days after which the vector store expires
   */
  days?: number;
}

/**
 * Tracks counts of files in different states within a vector store.
 */
export interface FileCounts {
  /**
   * Number of files whose processing was canceled
   */
  canceled?: number;

  /**
   * Number of files that failed processing
   */
  failed?: number;

  /**
   * Number of files currently being processed
   */
  in_progress?: number;

  /**
   * Number of successfully processed files
   */
  successful?: number;

  /**
   * Total number of files
   */
  total?: number;
}

export interface ScoredVectorStoreChunk {
  /**
   * file id
   */
  file_id: string;

  /**
   * rank of the chunk in a file
   */
  rank: number;

  /**
   * score of the chunk
   */
  score: number;

  /**
   * value of the chunk
   */
  value?:
    | string
    | ScoredVectorStoreChunk.ImageURLInput
    | ScoredVectorStoreChunk.TextInput
    | Record<string, unknown>
    | null;
}

export namespace ScoredVectorStoreChunk {
  /**
   * Model for image input validation.
   */
  export interface ImageURLInput {
    /**
     * The image input specification.
     */
    image: ImageURLInput.Image;

    /**
     * Input type identifier
     */
    type?: 'image_url';
  }

  export namespace ImageURLInput {
    /**
     * The image input specification.
     */
    export interface Image {
      /**
       * The image URL. Can be either a URL or a Data URI.
       */
      url: string;
    }
  }

  /**
   * Model for text input validation.
   *
   * Attributes: type: Input type identifier, always "text" text: The actual text
   * content, with length and whitespace constraints
   */
  export interface TextInput {
    /**
     * Text content to process
     */
    text: string;

    /**
     * Input type identifier
     */
    type?: 'text';
  }
}

export interface ScoredVectorStoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

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
   * chunks
   */
  chunks?: Array<ScoredVectorStoreChunk> | null;

  /**
   * List of error messages if processing failed
   */
  errors?: Array<string> | null;

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
 * Model representing a vector store with its metadata and timestamps.
 */
export interface VectorStore {
  /**
   * Unique identifier for the vector store
   */
  id: string;

  /**
   * Timestamp when the vector store was created
   */
  created_at: string;

  /**
   * Name of the vector store
   */
  name: string;

  /**
   * Timestamp when the vector store was last updated
   */
  updated_at: string;

  /**
   * Detailed description of the vector store's purpose and contents
   */
  description?: string | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: FileCounts;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

/**
 * Response model for vector store deletion.
 */
export interface VectorStoreDeleteResponse {
  /**
   * ID of the deleted vector store
   */
  id: string;

  /**
   * Whether the deletion was successful
   */
  deleted: boolean;

  /**
   * Type of the deleted object
   */
  object?: 'vector_store';
}

export interface VectorStoreSearchResponse {
  /**
   * The list of scored vector store files
   */
  data: Array<ScoredVectorStoreFile>;

  /**
   * Pagination model that includes total count of items.
   */
  pagination: VectorStoreSearchResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace VectorStoreSearchResponse {
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

export interface VectorStoreCreateParams {
  /**
   * Description of the vector store
   */
  description?: string | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional list of file IDs
   */
  file_ids?: Array<string> | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;

  /**
   * Name for the new vector store
   */
  name?: string | null;
}

export interface VectorStoreUpdateParams {
  /**
   * New description
   */
  description?: string | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;

  /**
   * New name for the vector store
   */
  name?: string | null;
}

export interface VectorStoreListParams extends LimitOffsetParams {}

export interface VectorStoreSearchParams {
  /**
   * Search query text
   */
  query: string;

  /**
   * IDs of vector stores to search
   */
  vector_store_ids: Array<string>;

  /**
   * Pagination options
   */
  pagination?: VectorStoreSearchParams.Pagination;

  /**
   * Search configuration options
   */
  search_options?: VectorStoreSearchParams.SearchOptions;
}

export namespace VectorStoreSearchParams {
  /**
   * Pagination options
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
  }

  /**
   * Search configuration options
   */
  export interface SearchOptions {
    /**
     * Whether to return matching text chunks
     */
    return_chunks?: boolean;

    /**
     * Whether to return file metadata
     */
    return_metadata?: boolean;

    /**
     * Whether to rewrite the query
     */
    rewrite_query?: boolean;

    /**
     * Minimum similarity score threshold
     */
    score_threshold?: number;
  }
}

VectorStores.VectorStoresLimitOffset = VectorStoresLimitOffset;
VectorStores.Files = Files;
VectorStores.VectorStoreFilesLimitOffset = VectorStoreFilesLimitOffset;

export declare namespace VectorStores {
  export {
    type ExpiresAfter as ExpiresAfter,
    type FileCounts as FileCounts,
    type ScoredVectorStoreChunk as ScoredVectorStoreChunk,
    type ScoredVectorStoreFile as ScoredVectorStoreFile,
    type VectorStore as VectorStore,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    VectorStoresLimitOffset as VectorStoresLimitOffset,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export {
    Files as Files,
    type VectorStoreFile as VectorStoreFile,
    type FileDeleteResponse as FileDeleteResponse,
    VectorStoreFilesLimitOffset as VectorStoreFilesLimitOffset,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };
}
