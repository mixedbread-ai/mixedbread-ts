// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileDeleteParams,
  FileDeleteResponse,
  FileListParams,
  FileListResponse,
  FileRetrieveParams,
  FileSearchParams,
  FileSearchResponse,
  FileUpdateParams,
  Files,
  ScoredStoreFile,
  StoreFile,
  StoreFileStatus,
} from './files';
import * as VectorStoresFilesAPI from '../vector-stores/files';
import * as VectorStoresAPI from '../vector-stores/vector-stores';
import { APIPromise } from '../../core/api-promise';
import { Cursor, type CursorParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Stores extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);

  /**
   * Create a new vector store.
   *
   * Args: vector_store_create: VectorStoreCreate object containing the name,
   * description, and metadata.
   *
   * Returns: VectorStore: The response containing the created vector store details.
   */
  create(body: StoreCreateParams, options?: RequestOptions): APIPromise<Store> {
    return this._client.post('/v1/stores', { body, ...options });
  }

  /**
   * Get a store by ID or name.
   *
   * Args: store_identifier: The ID or name of the store to retrieve.
   *
   * Returns: Store: The response containing the store details.
   */
  retrieve(storeIdentifier: string, options?: RequestOptions): APIPromise<Store> {
    return this._client.get(path`/v1/stores/${storeIdentifier}`, options);
  }

  /**
   * Update a store by ID or name.
   *
   * Args: store_identifier: The ID or name of the store to update. store_update:
   * StoreCreate object containing the name, description, and metadata.
   *
   * Returns: Store: The response containing the updated store details.
   */
  update(storeIdentifier: string, body: StoreUpdateParams, options?: RequestOptions): APIPromise<Store> {
    return this._client.put(path`/v1/stores/${storeIdentifier}`, { body, ...options });
  }

  /**
   * List all stores with optional search.
   *
   * Args: pagination: The pagination options. q: Optional search query to filter
   * vector stores.
   *
   * Returns: StoreListResponse: The list of stores.
   */
  list(
    query: StoreListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<StoresCursor, Store> {
    return this._client.getAPIList('/v1/stores', Cursor<Store>, { query, ...options });
  }

  /**
   * Delete a store by ID or name.
   *
   * Args: store_identifier: The ID or name of the store to delete.
   *
   * Returns: Store: The response containing the deleted store details.
   */
  delete(storeIdentifier: string, options?: RequestOptions): APIPromise<StoreDeleteResponse> {
    return this._client.delete(path`/v1/stores/${storeIdentifier}`, options);
  }

  /**
   * Get metadata facets
   */
  metadataFacets(
    body: StoreMetadataFacetsParams,
    options?: RequestOptions,
  ): APIPromise<StoreMetadataFacetsResponse> {
    return this._client.post('/v1/stores/metadata-facets', { body, ...options });
  }

  /**
   * Question answering
   */
  questionAnswering(
    body: StoreQuestionAnsweringParams,
    options?: RequestOptions,
  ): APIPromise<StoreQuestionAnsweringResponse> {
    return this._client.post('/v1/stores/question-answering', { body, ...options });
  }

  /**
   * Perform semantic search across store chunks.
   *
   * This endpoint searches through store chunks using semantic similarity matching.
   * It supports complex search queries with filters and returns relevance-scored
   * results.
   *
   * For the special 'mixedbread/web' store, this endpoint performs web search using
   * a mixture of different providers instead of semantic search. Web search results
   * are always reranked for consistent scoring.
   *
   * Args: search_params: Search configuration including: - query text or
   * embeddings - store_identifiers: List of store identifiers to search - file_ids:
   * Optional list of file IDs to filter chunks by (or tuple of list and condition
   * operator) - metadata filters - pagination parameters - sorting preferences
   * \_state: API state dependency \_ctx: Service context dependency
   *
   * Returns: StoreSearchResponse containing: - List of matched chunks with relevance
   * scores - Pagination details including total result count
   *
   * Raises: HTTPException (400): If search parameters are invalid HTTPException
   * (404): If no vector stores are found to search
   */
  search(body: StoreSearchParams, options?: RequestOptions): APIPromise<StoreSearchResponse> {
    return this._client.post('/v1/stores/search', { body, ...options });
  }
}

export type StoresCursor = Cursor<Store>;

/**
 * Model representing a store with its metadata and timestamps.
 */
export interface Store {
  /**
   * Unique identifier for the store
   */
  id: string;

  /**
   * Name of the store
   */
  name: string;

  /**
   * Detailed description of the store's purpose and contents
   */
  description?: string | null;

  /**
   * Whether the store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean;

  /**
   * Additional metadata associated with the store
   */
  metadata?: unknown;

  /**
   * Configuration for a store.
   */
  config?: Store.Config | null;

  /**
   * Counts of files in different states
   */
  file_counts?: Store.FileCounts;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: VectorStoresAPI.ExpiresAfter | null;

  /**
   * Processing status of the store
   */
  status?: 'expired' | 'in_progress' | 'completed';

  /**
   * Timestamp when the store was created
   */
  created_at: string;

  /**
   * Timestamp when the store was last updated
   */
  updated_at: string;

  /**
   * Timestamp when the store was last used
   */
  last_active_at?: string | null;

  /**
   * Total storage usage in bytes
   */
  usage_bytes?: number;

  /**
   * Total storage usage in tokens
   */
  usage_tokens?: number;

  /**
   * Optional expiration timestamp for the store
   */
  expires_at?: string | null;

  /**
   * Type of the object
   */
  object?: 'store';
}

export namespace Store {
  /**
   * Configuration for a store.
   */
  export interface Config {
    /**
     * Contextualize files with metadata
     */
    contextualization?: boolean | Config.ContextualizationConfig;
  }

  export namespace Config {
    export interface ContextualizationConfig {
      /**
       * Include all metadata or specific fields in the contextualization. Supports dot
       * notation for nested fields (e.g., 'author.name'). When True, all metadata is
       * included (flattened). When a list, only specified fields are included.
       */
      with_metadata?: boolean | Array<string>;
    }
  }

  /**
   * Counts of files in different states
   */
  export interface FileCounts {
    /**
     * Number of files waiting to be processed
     */
    pending?: number;

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
}

/**
 * Options for configuring store chunk searches.
 */
export interface StoreChunkSearchOptions {
  /**
   * Minimum similarity score threshold
   */
  score_threshold?: number;

  /**
   * Whether to rewrite the query. Ignored when agentic is enabled (the agent handles
   * query decomposition).
   */
  rewrite_query?: boolean;

  /**
   * Whether to rerank results and optional reranking configuration. Ignored when
   * agentic is enabled (the agent handles ranking).
   */
  rerank?: boolean | VectorStoresFilesAPI.RerankConfig | null;

  /**
   * Whether to use agentic multi-query search with automatic query decomposition and
   * ranking. When enabled, rewrite_query and rerank options are ignored.
   */
  agentic?: boolean | StoreChunkSearchOptions.AgenticSearchConfig | null;

  /**
   * Whether to return file metadata
   */
  return_metadata?: boolean;

  /**
   * Whether to apply search rules
   */
  apply_search_rules?: boolean;
}

export namespace StoreChunkSearchOptions {
  /**
   * Configuration for agentic multi-query search.
   */
  export interface AgenticSearchConfig {
    /**
     * Maximum number of search rounds
     */
    max_rounds?: number;

    /**
     * Maximum queries per round
     */
    queries_per_round?: number;

    /**
     * Results to fetch per query
     */
    results_per_query?: number;
  }
}

/**
 * Response model for store deletion.
 */
export interface StoreDeleteResponse {
  /**
   * ID of the deleted store
   */
  id: string;

  /**
   * Whether the deletion was successful
   */
  deleted: boolean;

  /**
   * Type of the deleted object
   */
  object?: 'store';
}

/**
 * Represents metadata facets for a store.
 */
export interface StoreMetadataFacetsResponse {
  /**
   * Metadata facets
   */
  facets: { [key: string]: { [key: string]: unknown } };
}

/**
 * Results from a question answering operation.
 */
export interface StoreQuestionAnsweringResponse {
  /**
   * The answer generated by the LLM
   */
  answer: string;

  /**
   * Source documents used to generate the answer
   */
  sources?: Array<
    | VectorStoresAPI.ScoredTextInputChunk
    | VectorStoresAPI.ScoredImageURLInputChunk
    | VectorStoresAPI.ScoredAudioURLInputChunk
    | VectorStoresAPI.ScoredVideoURLInputChunk
  >;
}

export interface StoreSearchResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of scored store file chunks
   */
  data: Array<
    | VectorStoresAPI.ScoredTextInputChunk
    | VectorStoresAPI.ScoredImageURLInputChunk
    | VectorStoresAPI.ScoredAudioURLInputChunk
    | VectorStoresAPI.ScoredVideoURLInputChunk
  >;
}

export interface StoreCreateParams {
  /**
   * Name for the new store. Can only contain lowercase letters, numbers, periods
   * (.), and hyphens (-).
   */
  name?: string | null;

  /**
   * Description of the store
   */
  description?: string | null;

  /**
   * Whether the store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: VectorStoresAPI.ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;

  /**
   * Configuration for a store.
   */
  config?: StoreCreateParams.Config | null;

  /**
   * Optional list of file IDs
   */
  file_ids?: Array<string> | null;
}

export namespace StoreCreateParams {
  /**
   * Configuration for a store.
   */
  export interface Config {
    /**
     * Contextualize files with metadata
     */
    contextualization?: boolean | Config.ContextualizationConfig;
  }

  export namespace Config {
    export interface ContextualizationConfig {
      /**
       * Include all metadata or specific fields in the contextualization. Supports dot
       * notation for nested fields (e.g., 'author.name'). When True, all metadata is
       * included (flattened). When a list, only specified fields are included.
       */
      with_metadata?: boolean | Array<string>;
    }
  }
}

export interface StoreUpdateParams {
  /**
   * New name for the store. Can only contain lowercase letters, numbers, periods
   * (.), and hyphens (-).
   */
  name?: string | null;

  /**
   * New description
   */
  description?: string | null;

  /**
   * Whether the store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean | null;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: VectorStoresAPI.ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;
}

export interface StoreListParams extends CursorParams {
  /**
   * Search query for fuzzy matching over name and description fields
   */
  q?: string | null;
}

export interface StoreMetadataFacetsParams {
  /**
   * Search query text
   */
  query?: string | null;

  /**
   * IDs or names of stores to search
   */
  store_identifiers: Array<string>;

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
  search_options?: StoreChunkSearchOptions;

  /**
   * Optional list of facets to return. Use dot for nested fields.
   */
  facets?: Array<string> | null;
}

export interface StoreQuestionAnsweringParams {
  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

  /**
   * IDs or names of stores to search
   */
  store_identifiers: Array<string>;

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
  search_options?: StoreChunkSearchOptions;

  /**
   * Whether to stream the answer
   */
  stream?: boolean;

  /**
   * Question answering configuration options
   */
  qa_options?: StoreQuestionAnsweringParams.QaOptions;
}

export namespace StoreQuestionAnsweringParams {
  /**
   * Question answering configuration options
   */
  export interface QaOptions {
    /**
     * Whether to use citations
     */
    cite?: boolean;

    /**
     * Whether to use multimodal context
     */
    multimodal?: boolean;
  }
}

export interface StoreSearchParams {
  /**
   * Search query text
   */
  query: string;

  /**
   * IDs or names of stores to search
   */
  store_identifiers: Array<string>;

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
  search_options?: StoreChunkSearchOptions;
}

Stores.Files = Files;

export declare namespace Stores {
  export {
    type Store as Store,
    type StoreChunkSearchOptions as StoreChunkSearchOptions,
    type StoreDeleteResponse as StoreDeleteResponse,
    type StoreMetadataFacetsResponse as StoreMetadataFacetsResponse,
    type StoreQuestionAnsweringResponse as StoreQuestionAnsweringResponse,
    type StoreSearchResponse as StoreSearchResponse,
    type StoresCursor as StoresCursor,
    type StoreCreateParams as StoreCreateParams,
    type StoreUpdateParams as StoreUpdateParams,
    type StoreListParams as StoreListParams,
    type StoreMetadataFacetsParams as StoreMetadataFacetsParams,
    type StoreQuestionAnsweringParams as StoreQuestionAnsweringParams,
    type StoreSearchParams as StoreSearchParams,
  };

  export {
    Files as Files,
    type ScoredStoreFile as ScoredStoreFile,
    type StoreFileStatus as StoreFileStatus,
    type StoreFile as StoreFile,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileSearchResponse as FileSearchResponse,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileSearchParams as FileSearchParams,
  };
}
