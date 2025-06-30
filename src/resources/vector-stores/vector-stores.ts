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
  Files,
  RerankConfig,
  ScoredVectorStoreFile,
  VectorStoreFile,
  VectorStoreFileStatus,
} from './files';
import { APIPromise } from '../../core/api-promise';
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
   * Get a vector store by ID or name.
   *
   * Args: vector_store_identifier: The ID or name of the vector store to retrieve.
   *
   * Returns: VectorStore: The response containing the vector store details.
   */
  retrieve(vectorStoreIdentifier: string, options?: RequestOptions): APIPromise<VectorStore> {
    return this._client.get(path`/v1/vector_stores/${vectorStoreIdentifier}`, options);
  }

  /**
   * Update a vector store by ID or name.
   *
   * Args: vector_store_identifier: The ID or name of the vector store to update.
   * vector_store_update: VectorStoreCreate object containing the name, description,
   * and metadata.
   *
   * Returns: VectorStore: The response containing the updated vector store details.
   */
  update(
    vectorStoreIdentifier: string,
    body: VectorStoreUpdateParams,
    options?: RequestOptions,
  ): APIPromise<VectorStore> {
    return this._client.put(path`/v1/vector_stores/${vectorStoreIdentifier}`, { body, ...options });
  }

  /**
   * List all vector stores with optional search.
   *
   * Args: pagination: The pagination options. q: Optional search query to filter
   * vector stores.
   *
   * Returns: VectorStoreListResponse: The list of vector stores.
   */
  list(
    query: VectorStoreListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VectorStoreListResponse> {
    return this._client.get('/v1/vector_stores', { query, ...options });
  }

  /**
   * Delete a vector store by ID or name.
   *
   * Args: vector_store_identifier: The ID or name of the vector store to delete.
   *
   * Returns: VectorStore: The response containing the deleted vector store details.
   */
  delete(vectorStoreIdentifier: string, options?: RequestOptions): APIPromise<VectorStoreDeleteResponse> {
    return this._client.delete(path`/v1/vector_stores/${vectorStoreIdentifier}`, options);
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
   * embeddings - vector_store_ids: List of vector stores to search - file_ids:
   * Optional list of file IDs to filter chunks by (or tuple of list and condition
   * operator) - metadata filters - pagination parameters - sorting preferences
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

export interface ScoredAudioURLInputChunk {
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

  /**
   * Input type identifier
   */
  type?: 'audio_url';

  /**
   * The audio input specification.
   */
  audio_url: ScoredAudioURLInputChunk.AudioURL;

  /**
   * speech recognition (sr) text of the audio
   */
  transcription?: string | null;

  /**
   * summary of the audio
   */
  summary?: string | null;
}

export namespace ScoredAudioURLInputChunk {
  /**
   * The audio input specification.
   */
  export interface AudioURL {
    /**
     * The audio URL. Can be either a URL or a Data URI.
     */
    url: string;
  }
}

export interface ScoredImageURLInputChunk {
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

  /**
   * Input type identifier
   */
  type?: 'image_url';

  /**
   * The image input specification.
   */
  image_url: ScoredImageURLInputChunk.ImageURL;

  /**
   * ocr text of the image
   */
  ocr_text?: string | null;

  /**
   * summary of the image
   */
  summary?: string | null;
}

export namespace ScoredImageURLInputChunk {
  /**
   * The image input specification.
   */
  export interface ImageURL {
    /**
     * The image URL. Can be either a URL or a Data URI.
     */
    url: string;

    /**
     * The image format/mimetype
     */
    format?: string;
  }
}

export interface ScoredTextInputChunk {
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

  /**
   * Input type identifier
   */
  type?: 'text';

  /**
   * Text content to process
   */
  text: string;
}

export interface ScoredVideoURLInputChunk {
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

  /**
   * Input type identifier
   */
  type?: 'video_url';

  /**
   * The video input specification.
   */
  video_url: ScoredVideoURLInputChunk.VideoURL;

  /**
   * speech recognition (sr) text of the video
   */
  transcription?: string | null;

  /**
   * summary of the video
   */
  summary?: string | null;
}

export namespace ScoredVideoURLInputChunk {
  /**
   * The video input specification.
   */
  export interface VideoURL {
    /**
     * The video URL. Can be either a URL or a Data URI.
     */
    url: string;
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
   * Whether the vector store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean;

  /**
   * Additional metadata associated with the vector store
   */
  metadata?: unknown;

  /**
   * Counts of files in different states
   */
  file_counts?: VectorStore.FileCounts;

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

export namespace VectorStore {
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
   * Whether to rerank results and optional reranking configuration
   */
  rerank?: boolean | FilesAPI.RerankConfig | null;

  /**
   * Whether to return file metadata
   */
  return_metadata?: boolean;
}

export interface VectorStoreListResponse {
  /**
   * Response model for cursor-based pagination.
   *
   * Examples: Forward pagination response: { "has_more": true, "first_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMSIsImlkIjoiYWJjMTIzIn0=", "last_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMCIsImlkIjoieHl6Nzg5In0=", "total": null }
   *
   *     Final page response:
   *         {
   *             "has_more": false,
   *             "first_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOSIsImlkIjoibGFzdDEyMyJ9",
   *             "last_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOCIsImlkIjoiZmluYWw0NTYifQ==",
   *             "total": 42
   *         }
   *
   *     Empty results:
   *         {
   *             "has_more": false,
   *             "first_cursor": null,
   *             "last_cursor": null,
   *             "total": 0
   *         }
   */
  pagination: VectorStoreListResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of vector stores
   */
  data: Array<VectorStore>;
}

export namespace VectorStoreListResponse {
  /**
   * Response model for cursor-based pagination.
   *
   * Examples: Forward pagination response: { "has_more": true, "first_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMSIsImlkIjoiYWJjMTIzIn0=", "last_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMCIsImlkIjoieHl6Nzg5In0=", "total": null }
   *
   *     Final page response:
   *         {
   *             "has_more": false,
   *             "first_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOSIsImlkIjoibGFzdDEyMyJ9",
   *             "last_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOCIsImlkIjoiZmluYWw0NTYifQ==",
   *             "total": 42
   *         }
   *
   *     Empty results:
   *         {
   *             "has_more": false,
   *             "first_cursor": null,
   *             "last_cursor": null,
   *             "total": 0
   *         }
   */
  export interface Pagination {
    /**
     * Contextual direction-aware flag: True if more items exist in the requested
     * pagination direction. For 'after': more items after this page. For 'before':
     * more items before this page.
     */
    has_more: boolean;

    /**
     * Cursor of the first item in this page. Use for backward pagination. None if page
     * is empty.
     */
    first_cursor: string | null;

    /**
     * Cursor of the last item in this page. Use for forward pagination. None if page
     * is empty.
     */
    last_cursor: string | null;

    /**
     * Total number of items available across all pages. Only included when
     * include_total=true was requested. Expensive operation - use sparingly.
     */
    total?: number | null;
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
  sources?: Array<
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
  >;
}

export interface VectorStoreSearchResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of scored vector store file chunks
   */
  data: Array<
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
  >;
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
   * Whether the vector store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean;

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
   * Whether the vector store can be accessed by anyone with valid login credentials
   */
  is_public?: boolean | null;

  /**
   * Represents an expiration policy for a vector store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;
}

export interface VectorStoreListParams {
  /**
   * Maximum number of items to return per page (1-100)
   */
  limit?: number;

  /**
   * Cursor for forward pagination - get items after this position. Use last_cursor
   * from previous response.
   */
  after?: string | null;

  /**
   * Cursor for backward pagination - get items before this position. Use
   * first_cursor from previous response.
   */
  before?: string | null;

  /**
   * Whether to include total count in response (expensive operation)
   */
  include_total?: boolean;

  /**
   * Search query for fuzzy matching over name and description fields
   */
  q?: string | null;
}

export interface VectorStoreQuestionAnsweringParams {
  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

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

    /**
     * Whether to use multimodal context
     */
    multimodal?: boolean;
  }
}

export interface VectorStoreSearchParams {
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
  search_options?: VectorStoreChunkSearchOptions;
}

VectorStores.Files = Files;

export declare namespace VectorStores {
  export {
    type ExpiresAfter as ExpiresAfter,
    type ScoredAudioURLInputChunk as ScoredAudioURLInputChunk,
    type ScoredImageURLInputChunk as ScoredImageURLInputChunk,
    type ScoredTextInputChunk as ScoredTextInputChunk,
    type ScoredVideoURLInputChunk as ScoredVideoURLInputChunk,
    type VectorStore as VectorStore,
    type VectorStoreChunkSearchOptions as VectorStoreChunkSearchOptions,
    type VectorStoreListResponse as VectorStoreListResponse,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreQuestionAnsweringResponse as VectorStoreQuestionAnsweringResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreQuestionAnsweringParams as VectorStoreQuestionAnsweringParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export {
    Files as Files,
    type RerankConfig as RerankConfig,
    type ScoredVectorStoreFile as ScoredVectorStoreFile,
    type VectorStoreFileStatus as VectorStoreFileStatus,
    type VectorStoreFile as VectorStoreFile,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileSearchResponse as FileSearchResponse,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileSearchParams as FileSearchParams,
  };
}
