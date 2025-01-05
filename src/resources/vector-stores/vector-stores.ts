// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileCreateResponse,
  FileDeleteResponse,
  FileListParams,
  FileListResponse,
  FileListResponsesOffsetPage,
  FileRetrieveResponse,
  Files,
} from './files';
import { OffsetPage, type OffsetPageParams } from '../../pagination';

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
  create(
    body: VectorStoreCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreCreateResponse> {
    return this._client.post('/v1/vector_stores', { body, ...options });
  }

  /**
   * Get a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to retrieve.
   *
   * Returns: VectorStore: The response containing the vector store details.
   */
  retrieve(
    vectorStoreId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreRetrieveResponse> {
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
  ): Core.APIPromise<VectorStoreUpdateResponse> {
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
  ): Core.PagePromise<VectorStoreListResponsesOffsetPage, VectorStoreListResponse>;
  list(
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoreListResponsesOffsetPage, VectorStoreListResponse>;
  list(
    query: VectorStoreListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<VectorStoreListResponsesOffsetPage, VectorStoreListResponse> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList('/v1/vector_stores', VectorStoreListResponsesOffsetPage, {
      query,
      ...options,
    });
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
  qa(body: VectorStoreQaParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/v1/vector_stores/question-answering', { body, ...options });
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

export class VectorStoreListResponsesOffsetPage extends OffsetPage<VectorStoreListResponse> {}

/**
 * Represents a filter with AND, OR, and NOT conditions.
 */
export interface SearchFilter {
  /**
   * List of conditions or filters to be ANDed together
   */
  all?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be ORed together
   */
  any?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be NOTed
   */
  none?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;
}

export namespace SearchFilter {
  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }
}

/**
 * Model representing a vector store with its metadata and timestamps.
 */
export interface VectorStoreCreateResponse {
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
  expires_after?: VectorStoreCreateResponse.ExpiresAfter | null;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: VectorStoreCreateResponse.FileCounts;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

export namespace VectorStoreCreateResponse {
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
   * Counts of files in different states
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
}

/**
 * Model representing a vector store with its metadata and timestamps.
 */
export interface VectorStoreRetrieveResponse {
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
  expires_after?: VectorStoreRetrieveResponse.ExpiresAfter | null;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: VectorStoreRetrieveResponse.FileCounts;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

export namespace VectorStoreRetrieveResponse {
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
   * Counts of files in different states
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
}

/**
 * Model representing a vector store with its metadata and timestamps.
 */
export interface VectorStoreUpdateResponse {
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
  expires_after?: VectorStoreUpdateResponse.ExpiresAfter | null;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: VectorStoreUpdateResponse.FileCounts;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

export namespace VectorStoreUpdateResponse {
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
   * Counts of files in different states
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
}

/**
 * Model representing a vector store with its metadata and timestamps.
 */
export interface VectorStoreListResponse {
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
  expires_after?: VectorStoreListResponse.ExpiresAfter | null;

  /**
   * Optional expiration timestamp for the vector store
   */
  expires_at?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: VectorStoreListResponse.FileCounts;

  /**
   * Timestamp when the vector store was last used
   */
  last_active_at?: string | null;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown | null;

  /**
   * Type of the object
   */
  object?: 'vector_store';
}

export namespace VectorStoreListResponse {
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
   * Counts of files in different states
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

export type VectorStoreQaResponse = unknown;

export interface VectorStoreSearchResponse {
  /**
   * The list of scored vector store files
   */
  data: Array<VectorStoreSearchResponse.Data>;

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
  export interface Data {
    /**
     * file id
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
     * usage in bytes
     */
    usage_bytes: number;

    /**
     * vector store id
     */
    vector_store_id: string;

    /**
     * version of the file
     */
    version: number;

    /**
     * chunks
     */
    chunks?: Array<Data.Chunk> | null;

    /**
     * metadata
     */
    metadata?: unknown | null;
  }

  export namespace Data {
    export interface Chunk {
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
      value?: string | Chunk.ImageURLInput | Chunk.TextInput | Record<string, unknown> | null;
    }

    export namespace Chunk {
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

export interface VectorStoreCreateParams {
  /**
   * Description of the vector store
   */
  description?: string | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: VectorStoreCreateParams.ExpiresAfter | null;

  /**
   * Optional list of file IDs
   */
  file_ids?: Array<string> | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown | null;

  /**
   * Name for the new vector store
   */
  name?: string | null;
}

export namespace VectorStoreCreateParams {
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
}

export interface VectorStoreUpdateParams {
  /**
   * New description
   */
  description?: string | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: VectorStoreUpdateParams.ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown | null;

  /**
   * New name for the vector store
   */
  name?: string | null;
}

export namespace VectorStoreUpdateParams {
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
}

export interface VectorStoreListParams extends OffsetPageParams {}

export interface VectorStoreQaParams {
  /**
   * IDs of vector stores to search
   */
  vector_store_ids: Array<string>;

  /**
   * Filter or condition
   */
  filters?:
    | SearchFilter
    | VectorStoreQaParams.SearchFilterCondition
    | Array<SearchFilter | VectorStoreQaParams.SearchFilterCondition>
    | null;

  /**
   * Pagination options
   */
  pagination?: VectorStoreQaParams.Pagination;

  /**
   * Question answering configuration options
   */
  qa_options?: VectorStoreQaParams.QaOptions;

  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

  /**
   * Search configuration options
   */
  search_options?: VectorStoreQaParams.SearchOptions;

  /**
   * Whether to stream the answer
   */
  stream?: boolean;
}

export namespace VectorStoreQaParams {
  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

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
   * Question answering configuration options
   */
  export interface QaOptions {
    /**
     * Whether to use citations
     */
    cite?: boolean;
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
   * Filter or condition
   */
  filters?:
    | SearchFilter
    | VectorStoreSearchParams.SearchFilterCondition
    | Array<SearchFilter | VectorStoreSearchParams.SearchFilterCondition>
    | null;

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
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

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

VectorStores.VectorStoreListResponsesOffsetPage = VectorStoreListResponsesOffsetPage;
VectorStores.Files = Files;
VectorStores.FileListResponsesOffsetPage = FileListResponsesOffsetPage;

export declare namespace VectorStores {
  export {
    type SearchFilter as SearchFilter,
    type VectorStoreCreateResponse as VectorStoreCreateResponse,
    type VectorStoreRetrieveResponse as VectorStoreRetrieveResponse,
    type VectorStoreUpdateResponse as VectorStoreUpdateResponse,
    type VectorStoreListResponse as VectorStoreListResponse,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreQaResponse as VectorStoreQaResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    VectorStoreListResponsesOffsetPage as VectorStoreListResponsesOffsetPage,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreQaParams as VectorStoreQaParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export {
    Files as Files,
    type FileCreateResponse as FileCreateResponse,
    type FileRetrieveResponse as FileRetrieveResponse,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    FileListResponsesOffsetPage as FileListResponsesOffsetPage,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };
}
