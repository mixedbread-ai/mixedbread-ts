// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as Shared from '../shared';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileDeleteResponse,
  FileListParams,
  FileSearchParams,
  FileSearchResponse,
  Files,
  ScoredVectorStoreFile,
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
   * Question answering
   */
  questionAnswering(
    body: VectorStoreQuestionAnsweringParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    return this._client.post('/v1/vector_stores/question-answering', { body, ...options });
  }

  /**
   * Perform semantic search across vector store chunks.
   *
   * This endpoint searches through vector store chunks using semantic similarity
   * matching. It supports complex search queries with filters and returns
   * relevance-scored results.
   *
   * Args: search_params: Search configuration including: - query text or
   * embeddings - metadata filters - pagination parameters - sorting preferences
   * \_state: API state dependency \_ctx: Service context dependency
   *
   * Returns: VectorStoreSearchChunkResponse containing: - List of matched chunks
   * with relevance scores - Pagination details including total result count
   *
   * Raises: HTTPException (400): If search parameters are invalid HTTPException
   * (404): If no vector stores are found to search
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
   * position of the chunk in a file
   */
  position: number;

  /**
   * score of the chunk
   */
  score: number;

  /**
   * vector store id
   */
  vector_store_id: string;

  /**
   * content of the chunk
   */
  content?: string | null;

  /**
   * file metadata
   */
  metadata?: unknown;

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
 * Options for configuring vector store searches.
 */
export interface VectorStoreSearchOptions {
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

export type VectorStoreQuestionAnsweringResponse = unknown;

export interface VectorStoreSearchResponse {
  /**
   * The list of scored vector store file chunks
   */
  data: Array<ScoredVectorStoreChunk>;

  /**
   * The object type of the response
   */
  object?: 'list';
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

export interface VectorStoreQuestionAnsweringParams {
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
   * Question answering configuration options
   */
  qa_options?: VectorStoreQuestionAnsweringParams.QaOptions;

  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

  /**
   * Search configuration options
   */
  search_options?: VectorStoreSearchOptions;

  /**
   * Whether to stream the answer
   */
  stream?: boolean;

  /**
   * Number of results to return
   */
  top_k?: number;
}

export namespace VectorStoreQuestionAnsweringParams {
  /**
   * Question answering configuration options
   */
  export interface QaOptions {
    /**
     * Whether to use citations
     */
    cite?: boolean;
  }
}

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
  search_options?: VectorStoreSearchOptions;

  /**
   * Number of results to return
   */
  top_k?: number;
}

VectorStores.VectorStoresLimitOffset = VectorStoresLimitOffset;
VectorStores.Files = Files;
VectorStores.VectorStoreFilesLimitOffset = VectorStoreFilesLimitOffset;

export declare namespace VectorStores {
  export {
    type ExpiresAfter as ExpiresAfter,
    type FileCounts as FileCounts,
    type ScoredVectorStoreChunk as ScoredVectorStoreChunk,
    type VectorStore as VectorStore,
    type VectorStoreSearchOptions as VectorStoreSearchOptions,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreQuestionAnsweringResponse as VectorStoreQuestionAnsweringResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    VectorStoresLimitOffset as VectorStoresLimitOffset,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreQuestionAnsweringParams as VectorStoreQuestionAnsweringParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export {
    Files as Files,
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
