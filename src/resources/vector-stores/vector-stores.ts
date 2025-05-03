// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileDeleteParams,
  FileDeleteResponse,
  FileListParams,
  FileRetrieveParams,
  FileSearchParams,
  FileSearchResponse,
  Files,
  ScoredVectorStoreFile,
  VectorStoreFile,
  VectorStoreFilesLimitOffset,
} from './files';
import { APIPromise } from '../../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

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
  create(body: VectorStoreCreateParams, options?: RequestOptions): APIPromise<VectorStore> {
    return this._client.post('/v1/vector_stores', { body, ...options });
  }

  /**
   * Get a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to retrieve.
   *
   * Returns: VectorStore: The response containing the vector store details.
   */
  retrieve(vectorStoreID: string, options?: RequestOptions): APIPromise<VectorStore> {
    return this._client.get(path`/v1/vector_stores/${vectorStoreID}`, options);
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
    vectorStoreID: string,
    body: VectorStoreUpdateParams,
    options?: RequestOptions,
  ): APIPromise<VectorStore> {
    return this._client.put(path`/v1/vector_stores/${vectorStoreID}`, { body, ...options });
  }

  /**
   * List all vector stores.
   *
   * Args: pagination: The pagination options.
   *
   * Returns: VectorStoreListResponse: The list of vector stores.
   */
  list(
    query: VectorStoreListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<VectorStoresLimitOffset, VectorStore> {
    return this._client.getAPIList('/v1/vector_stores', LimitOffset<VectorStore>, { query, ...options });
  }

  /**
   * Delete a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to delete.
   *
   * Returns: VectorStore: The response containing the deleted vector store details.
   */
  delete(vectorStoreID: string, options?: RequestOptions): APIPromise<VectorStoreDeleteResponse> {
    return this._client.delete(path`/v1/vector_stores/${vectorStoreID}`, options);
  }

  /**
   * Question answering
   */
  questionAnswering(
    body: VectorStoreQuestionAnsweringParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreQuestionAnsweringResponse> {
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
  search(body: VectorStoreSearchParams, options?: RequestOptions): APIPromise<VectorStoreSearchResponse> {
    return this._client.post('/v1/vector_stores/search', { body, ...options });
  }
}

export type VectorStoresLimitOffset = LimitOffset<VectorStore>;

/**
 * Represents an expiration policy for a vector store.
 */
export interface ExpiresAfter {
  /**
   * Anchor date for the expiration policy
   */
  anchor?: 'last_active_at';

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
   * Number of files currently being processed
   */
  in_progress?: number;

  /**
   * Number of files whose processing was cancelled
   */
  cancelled?: number;

  /**
   * Number of successfully processed files
   */
  completed?: number;

  /**
   * Number of files that failed processing
   */
  failed?: number;

  /**
   * Total number of files
   */
  total?: number;
}

export interface ScoredVectorStoreChunk {
  /**
   * position of the chunk in a file
   */
  position: number;

  /**
   * value of the chunk
   */
  value?:
    | string
    | ScoredVectorStoreChunk.ImageURLInput
    | ScoredVectorStoreChunk.TextInput
    | Record<string, unknown>
    | null;

  /**
   * content of the chunk
   */
  content?: string | null;

  /**
   * score of the chunk
   */
  score: number;

  /**
   * file id
   */
  file_id: string;

  /**
   * filename
   */
  filename: string;

  /**
   * vector store id
   */
  vector_store_id: string;

  /**
   * file metadata
   */
  metadata?: unknown;
}

export namespace ScoredVectorStoreChunk {
  /**
   * Model for image input validation.
   */
  export interface ImageURLInput {
    /**
     * Input type identifier
     */
    type?: 'image_url';

    /**
     * The image input specification.
     */
    image_url: ImageURLInput.ImageURL;
  }

  export namespace ImageURLInput {
    /**
     * The image input specification.
     */
    export interface ImageURL {
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
     * Input type identifier
     */
    type?: 'text';

    /**
     * Text content to process
     */
    text: string;
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
   * Name of the vector store
   */
  name: string;

  /**
   * Detailed description of the vector store's purpose and contents
   */
  description?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown;

  /**
   * Counts of files in different states
   */
  file_counts?: FileCounts;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Processing status of the vector store
   */
  status?: 'expired' | 'in_progress' | 'completed';

  /**
   * Timestamp when the vector store was created
   */
  created_at: string;

  /**
   * Timestamp when the vector store was last updated
   */
  updated_at: string;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Total storage usage in bytes
   */
  usage_bytes?: number;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

/**
 * Options for configuring vector store chunk searches.
 */
export interface VectorStoreChunkSearchOptions {
  /**
   * Minimum similarity score threshold
   */
  score_threshold?: number;

  /**
   * Whether to rewrite the query
   */
  rewrite_query?: boolean;

  /**
   * Whether to return file metadata
   */
  return_metadata?: boolean;
}

/**
 * Options for configuring vector store file searches.
 */
export interface VectorStoreFileSearchOptions {
  /**
   * Minimum similarity score threshold
   */
  score_threshold?: number;

  /**
   * Whether to rewrite the query
   */
  rewrite_query?: boolean;

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

/**
 * Results from a question answering operation.
 */
export interface VectorStoreQuestionAnsweringResponse {
  /**
   * The answer generated by the LLM
   */
  answer: string;

  /**
   * Source documents used to generate the answer
   */
  sources?: Array<ScoredVectorStoreChunk>;
}

export interface VectorStoreSearchResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of scored vector store file chunks
   */
  data: Array<ScoredVectorStoreChunk>;
}

export interface VectorStoreCreateParams {
  /**
   * Name for the new vector store
   */
  name?: string | null;

  /**
   * Description of the vector store
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
   * Optional list of file IDs
   */
  file_ids?: Array<string> | null;
}

export interface VectorStoreUpdateParams {
  /**
   * New name for the vector store
   */
  name?: string | null;

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
}

export interface VectorStoreListParams extends LimitOffsetParams {}

export interface VectorStoreQuestionAnsweringParams {
  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

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
  search_options?: VectorStoreChunkSearchOptions;

  /**
   * Whether to stream the answer
   */
  stream?: boolean;

  /**
   * Question answering configuration options
   */
  qa_options?: VectorStoreQuestionAnsweringParams.QaOptions;
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
  search_options?: VectorStoreChunkSearchOptions;
}

VectorStores.Files = Files;

export declare namespace VectorStores {
  export {
    type ExpiresAfter as ExpiresAfter,
    type FileCounts as FileCounts,
    type ScoredVectorStoreChunk as ScoredVectorStoreChunk,
    type VectorStore as VectorStore,
    type VectorStoreChunkSearchOptions as VectorStoreChunkSearchOptions,
    type VectorStoreFileSearchOptions as VectorStoreFileSearchOptions,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreQuestionAnsweringResponse as VectorStoreQuestionAnsweringResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    type VectorStoresLimitOffset as VectorStoresLimitOffset,
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
    type VectorStoreFilesLimitOffset as VectorStoreFilesLimitOffset,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileSearchParams as FileSearchParams,
  };
}
