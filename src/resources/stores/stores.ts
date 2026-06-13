// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as ContentAPI from '../extractions/content';
import * as FilesAPI from './files';
import {
  AudioURLInputChunk,
  FileCreateParams,
  FileDeleteParams,
  FileDeleteResponse,
  FileListParams,
  FileListResponse,
  FileRetrieveParams,
  FileUpdateParams,
  Files,
  ImageURLInputChunk,
  StoreFile,
  StoreFileConfig,
  StoreFileStatus,
  TextInputChunk,
  VideoURLInputChunk,
} from './files';
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
   *
   * @example
   * ```ts
   * const store = await client.stores.create();
   * ```
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
   *
   * @example
   * ```ts
   * const store = await client.stores.retrieve(
   *   'store_identifier',
   * );
   * ```
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
   *
   * @example
   * ```ts
   * const store = await client.stores.update(
   *   'store_identifier',
   * );
   * ```
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
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const store of client.stores.list()) {
   *   // ...
   * }
   * ```
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
   *
   * @example
   * ```ts
   * const store = await client.stores.delete(
   *   'store_identifier',
   * );
   * ```
   */
  delete(storeIdentifier: string, options?: RequestOptions): APIPromise<StoreDeleteResponse> {
    return this._client.delete(path`/v1/stores/${storeIdentifier}`, options);
  }

  /**
   * Match store chunks against a regular expression.
   *
   * Unlike `/stores/search`, this runs your regex against the literal text of each
   * chunk. Use it to find chunks containing a specific token, identifier, error
   * code, or literal phrase.
   *
   * grep targets a single store and does not support pagination; raise `top_k` to
   * retrieve more matches.
   *
   * Args: grep_params: Grep configuration including: - pattern: RE2 regular
   * expression matched against chunk text - targets: chunk content groups to match
   * (`text`, `generated`) - case_sensitive: whether the pattern is case-sensitive -
   * store_identifiers: the single store to grep - file_ids: optional list of file
   * IDs to filter chunks by - filters: optional metadata filter conditions - top_k:
   * number of matches to return
   *
   * Returns: StoreGrepResponse containing the list of matching chunks.
   *
   * Raises: HTTPException (400): If grep parameters are invalid HTTPException (404):
   * If the store is not found
   *
   * @example
   * ```ts
   * const response = await client.stores.grep({
   *   store_identifiers: ['string'],
   *   pattern: 'ERR-\\d{4}',
   * });
   * ```
   */
  grep(body: StoreGrepParams, options?: RequestOptions): APIPromise<StoreGrepResponse> {
    return this._client.post('/v1/stores/grep', { body, ...options });
  }

  /**
   * List store chunks purely by metadata filters — no embeddings, no semantic
   * similarity, no reranking.
   *
   * Unlike `/stores/search`, this endpoint does not require a query and never runs a
   * vector lookup. It returns chunks whose file and chunk metadata satisfy
   * `filters`, optionally ordered by a numeric metadata field via `sort_by`. Useful
   * for ranked retrieval over numeric attributes (e.g. price, BPM) and for
   * reproducing the agentic `filter_chunks` tool externally.
   *
   * list-chunks targets a single store and does not support pagination; raise
   * `top_k` to retrieve more chunks.
   *
   * Args: filter_params: Filter configuration including: - store_identifiers: the
   * single store to filter against - filters: optional metadata filter conditions -
   * file_ids: optional list of file IDs to filter chunks by - sort_by: optional
   * metadata field path, or `(field, ascending)` tuple, for numeric ordering -
   * top_k: number of chunks to return
   *
   * Returns: StoreListChunksResponse containing the list of matching chunks.
   *
   * Raises: HTTPException (400): If filter parameters are invalid or multiple stores
   * are passed HTTPException (404): If the store is not found
   *
   * @example
   * ```ts
   * const response = await client.stores.listChunks({
   *   store_identifiers: ['string'],
   * });
   * ```
   */
  listChunks(body: StoreListChunksParams, options?: RequestOptions): APIPromise<StoreListChunksResponse> {
    return this._client.post('/v1/stores/list-chunks', { body, ...options });
  }

  /**
   * Get metadata facets
   *
   * @example
   * ```ts
   * const response = await client.stores.metadataFacets({
   *   store_identifiers: ['string'],
   * });
   * ```
   */
  metadataFacets(
    body: StoreMetadataFacetsParams,
    options?: RequestOptions,
  ): APIPromise<StoreMetadataFacetsResponse> {
    return this._client.post('/v1/stores/metadata-facets', { body, ...options });
  }

  /**
   * Question answering
   *
   * @example
   * ```ts
   * const response = await client.stores.questionAnswering({
   *   store_identifiers: ['string'],
   * });
   * ```
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
   *
   * @example
   * ```ts
   * const response = await client.stores.search({
   *   store_identifiers: ['string'],
   *   query: 'how to configure SSL',
   * });
   * ```
   */
  search(body: StoreSearchParams, options?: RequestOptions): APIPromise<StoreSearchResponse> {
    return this._client.post('/v1/stores/search', { body, ...options });
  }
}

export type StoresCursor = Cursor<Store>;

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
   * Whether the final retrieved chunk list must provide exactly top_k ranked chunks
   */
  strict_top_k?: boolean;

  /**
   * Controls when retrieved image content is provided to the agent. `auto` sends
   * images only when no OCR text or summary is available, `never` disables image
   * content, and `always` sends image content when available.
   */
  media_content?: 'auto' | 'never' | 'always';

  /**
   * Additional custom instructions (followed only when not in conflict with existing
   * rules)
   */
  instructions?: string | null;

  /**
   * Internal: when set, the response includes a `trace` field with the full
   * tool-call timeline. Used by the Mixedbread playground; not part of the
   * documented public API.
   */
  verbose?: boolean;
}

export interface AudioChunkGeneratedMetadata {
  type?: 'audio';

  file_type?: string;

  file_size?: number | null;

  total_duration_seconds?: number | null;

  sample_rate?: number | null;

  channels?: number | null;

  audio_format?: number | null;

  bpm?: number | null;

  file_extension?: string | null;

  [k: string]: unknown;
}

/**
 * Model for audio URL validation.
 */
export interface AudioURL {
  /**
   * The audio URL. Can be either a URL or a Data URI.
   */
  url: string;
}

export interface CodeChunkGeneratedMetadata {
  type?: 'code';

  file_type: string;

  language?: string | null;

  word_count?: number | null;

  file_size?: number | null;

  start_line?: number;

  num_lines?: number;

  file_extension?: string | null;

  [k: string]: unknown;
}

export interface ContextualizationConfig {
  /**
   * Include all metadata or specific fields in the contextualization. Supports dot
   * notation for nested fields (e.g., 'author.name'). When True, all metadata is
   * included (flattened). When a list, only specified fields are included.
   */
  with_metadata?: boolean | Array<string>;

  /**
   * Use an LLM to generate a short context for each text chunk that situates it
   * within the full document, improving retrieval accuracy. Only applies to text
   * content during non-sliced ingestion.
   */
  with_file_context?: boolean;
}

/**
 * Represents an expiration policy for a store.
 */
export interface ExpiresAfter {
  /**
   * Anchor date for the expiration policy
   */
  anchor?: 'last_active_at';

  /**
   * Number of days after which the store expires
   */
  days?: number;
}

/**
 * Tracks counts of files in different states within a store.
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

export interface ImageChunkGeneratedMetadata {
  type?: 'image';

  file_type?: string;

  file_size?: number | null;

  width?: number | null;

  height?: number | null;

  file_extension?: string | null;

  [k: string]: unknown;
}

/**
 * Model for image URL validation.
 */
export interface ImageURLOutput {
  /**
   * The image URL. Can be either a URL or a Data URI.
   */
  url: string;

  /**
   * The image format/mimetype
   */
  format?: string;
}

export interface MarkdownChunkGeneratedMetadata {
  type?: 'markdown';

  file_type?: 'text/markdown';

  language?: string | null;

  word_count?: number | null;

  file_size?: number | null;

  chunk_headings?: Array<MarkdownHeading>;

  heading_context?: Array<MarkdownHeading>;

  start_line?: number;

  num_lines?: number;

  file_extension?: string | null;

  frontmatter?: { [key: string]: unknown };

  [k: string]: unknown;
}

export interface MarkdownHeading {
  level: number;

  text: string;
}

export interface PdfChunkGeneratedMetadata {
  type?: 'pdf';

  file_type?: 'application/pdf';

  total_pages?: number | null;

  total_size?: number | null;

  file_extension?: string | null;

  [k: string]: unknown;
}

/**
 * Represents a reranking configuration.
 */
export interface RerankConfig {
  /**
   * The name of the reranking model
   */
  model?: string;

  /**
   * Whether to include metadata in the reranked results
   */
  with_metadata?: boolean | Array<string>;

  /**
   * Maximum number of results to return after reranking. If None, returns all
   * reranked results.
   */
  top_k?: number | null;
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
  generated_metadata?:
    | MarkdownChunkGeneratedMetadata
    | TextChunkGeneratedMetadata
    | PdfChunkGeneratedMetadata
    | CodeChunkGeneratedMetadata
    | AudioChunkGeneratedMetadata
    | VideoChunkGeneratedMetadata
    | ImageChunkGeneratedMetadata
    | null;

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
   * store id
   */
  store_id: string;

  /**
   * external identifier for this file
   */
  external_id?: string | null;

  /**
   * file metadata
   */
  metadata?: unknown;

  /**
   * Input type identifier
   */
  type?: 'audio_url';

  /**
   * speech recognition (sr) text of the audio
   */
  transcription?: string | null;

  /**
   * summary of the audio
   */
  summary?: string | null;

  /**
   * Model for audio URL validation.
   */
  audio_url?: AudioURL | null;

  /**
   * The sampling rate of the audio.
   */
  sampling_rate: number;
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
  generated_metadata?:
    | MarkdownChunkGeneratedMetadata
    | TextChunkGeneratedMetadata
    | PdfChunkGeneratedMetadata
    | CodeChunkGeneratedMetadata
    | AudioChunkGeneratedMetadata
    | VideoChunkGeneratedMetadata
    | ImageChunkGeneratedMetadata
    | null;

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
   * store id
   */
  store_id: string;

  /**
   * external identifier for this file
   */
  external_id?: string | null;

  /**
   * file metadata
   */
  metadata?: unknown;

  /**
   * Input type identifier
   */
  type?: 'image_url';

  /**
   * ocr text of the image
   */
  ocr_text?: string | null;

  /**
   * summary of the image
   */
  summary?: string | null;

  /**
   * Model for image URL validation.
   */
  image_url?: ImageURLOutput | null;
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
  generated_metadata?:
    | MarkdownChunkGeneratedMetadata
    | TextChunkGeneratedMetadata
    | PdfChunkGeneratedMetadata
    | CodeChunkGeneratedMetadata
    | AudioChunkGeneratedMetadata
    | VideoChunkGeneratedMetadata
    | ImageChunkGeneratedMetadata
    | null;

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
   * store id
   */
  store_id: string;

  /**
   * external identifier for this file
   */
  external_id?: string | null;

  /**
   * file metadata
   */
  metadata?: unknown;

  /**
   * Input type identifier
   */
  type?: 'text';

  /**
   * The offset of the text in the file relative to the start of the file.
   */
  offset?: number;

  /**
   * Text content
   */
  text?: string | null;

  /**
   * LLM-generated context that situates this chunk within its source document
   */
  context?: string | null;

  /**
   * summary of the text chunk
   */
  summary?: string | null;
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
  generated_metadata?:
    | MarkdownChunkGeneratedMetadata
    | TextChunkGeneratedMetadata
    | PdfChunkGeneratedMetadata
    | CodeChunkGeneratedMetadata
    | AudioChunkGeneratedMetadata
    | VideoChunkGeneratedMetadata
    | ImageChunkGeneratedMetadata
    | null;

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
   * store id
   */
  store_id: string;

  /**
   * external identifier for this file
   */
  external_id?: string | null;

  /**
   * file metadata
   */
  metadata?: unknown;

  /**
   * Input type identifier
   */
  type?: 'video_url';

  /**
   * speech recognition (sr) text of the video
   */
  transcription?: string | null;

  /**
   * summary of the video
   */
  summary?: string | null;

  /**
   * Model for video URL validation.
   */
  video_url?: VideoURL | null;
}

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
   * License for public stores
   */
  license?: string | null;

  /**
   * Additional metadata associated with the store
   */
  metadata?: unknown;

  /**
   * Configuration for a store.
   */
  config?: StoreConfig | null;

  /**
   * Customer bucket backing this store's storage; null = platform default
   */
  bucket_id?: string | null;

  /**
   * Counts of files in different states
   */
  file_counts?: FileCounts;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: ExpiresAfter | null;

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
  rerank?: boolean | RerankConfig | null;

  /**
   * Whether to use agentic multi-query search with automatic query decomposition and
   * ranking. When enabled, rewrite_query and rerank options are ignored.
   */
  agentic?: boolean | AgenticSearchConfig | null;

  /**
   * Whether to return file metadata
   */
  return_metadata?: boolean;

  /**
   * Whether to apply search rules
   */
  apply_search_rules?: boolean;
}

/**
 * Configuration for a store.
 */
export interface StoreConfig {
  /**
   * Contextualize files with metadata
   */
  contextualization?: boolean | ContextualizationConfig;

  /**
   * Whether to save original content in the store. When False, only vectors are
   * indexed without the original content (index-only mode). This is useful for data
   * privacy. Note: Reranking is not supported when content is not saved.
   */
  save_content?: boolean;
}

export interface TextChunkGeneratedMetadata {
  type?: 'text';

  file_type?: 'text/plain';

  language?: string | null;

  word_count?: number | null;

  file_size?: number | null;

  start_line?: number;

  num_lines?: number;

  file_extension?: string | null;

  [k: string]: unknown;
}

export interface VideoChunkGeneratedMetadata {
  type?: 'video';

  file_type?: string;

  file_size?: number | null;

  total_duration_seconds?: number | null;

  fps?: number | null;

  width?: number | null;

  height?: number | null;

  frame_count?: number | null;

  has_audio_stream?: boolean;

  bpm?: number | null;

  file_extension?: string | null;

  [k: string]: unknown;
}

/**
 * Model for video URL validation.
 */
export interface VideoURL {
  /**
   * The video URL. Can be either a URL or a Data URI.
   */
  url: string;
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

export interface StoreGrepResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of chunks matching the pattern
   */
  data: Array<
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
  >;
}

export interface StoreListChunksResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of chunks matching the metadata filters
   */
  data: Array<
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
  >;
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
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
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
    ScoredTextInputChunk | ScoredImageURLInputChunk | ScoredAudioURLInputChunk | ScoredVideoURLInputChunk
  >;

  [k: string]: unknown;
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
   * License for public stores
   */
  license?: string | null;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;

  /**
   * Configuration for a store.
   */
  config?: StoreConfig | null;

  /**
   * Optional list of file IDs
   */
  file_ids?: Array<string> | null;
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
   * License for public stores
   */
  license?: string | null;

  /**
   * Represents an expiration policy for a store.
   */
  expires_after?: ExpiresAfter | null;

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

export interface StoreGrepParams {
  /**
   * IDs or names of stores
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
    | StoreGrepParams.SearchFilterInput
    | Shared.SearchFilterCondition
    | Array<StoreGrepParams.SearchFilterInput | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Regular expression (RE2 syntax) matched against chunk text
   */
  pattern: string;

  /**
   * Chunk content groups to match against. `text` matches the original text of text
   * chunks; `generated` matches ingestion-derived fields (transcription, OCR text,
   * summaries).
   */
  targets?: Array<'text' | 'generated'>;

  /**
   * Whether the regular expression is case-sensitive
   */
  case_sensitive?: boolean;

  /**
   * Whether to return file metadata
   */
  return_metadata?: boolean;
}

export namespace StoreGrepParams {
  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }
}

export interface StoreListChunksParams {
  /**
   * IDs or names of stores
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
    | StoreListChunksParams.SearchFilterInput
    | Shared.SearchFilterCondition
    | Array<StoreListChunksParams.SearchFilterInput | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Optional sort applied to the returned chunks. Pass a metadata field path or a
   * tuple of (field path, ascending). Unprefixed dot paths target file metadata;
   * generated_metadata.\* targets chunk metadata.
   */
  sort_by?: string | Array<unknown> | null;

  /**
   * Search configuration options
   */
  search_options?: StoreChunkSearchOptions;
}

export namespace StoreListChunksParams {
  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }
}

export interface StoreMetadataFacetsParams {
  /**
   * IDs or names of stores
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
    | StoreMetadataFacetsParams.SearchFilterInput
    | Shared.SearchFilterCondition
    | Array<StoreMetadataFacetsParams.SearchFilterInput | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Search query text
   */
  query?: string | null;

  /**
   * Search configuration options
   */
  search_options?: StoreChunkSearchOptions;

  /**
   * Optional list of facets to return. Use dot for nested fields.
   */
  facets?: Array<string> | null;

  /**
   * Maximum number of distinct metadata fields (keys) to return.
   */
  max_fields?: number;

  /**
   * Maximum number of distinct values returned per field, ranked by count.
   */
  max_values_per_field?: number;

  /**
   * Maximum number of store files scanned to compute facets.
   */
  max_files?: number;
}

export namespace StoreMetadataFacetsParams {
  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }
}

export interface StoreQuestionAnsweringParams {
  /**
   * IDs or names of stores
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
    | StoreQuestionAnsweringParams.SearchFilterInput
    | Shared.SearchFilterCondition
    | Array<StoreQuestionAnsweringParams.SearchFilterInput | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Question to answer. If not provided, the question will be extracted from the
   * passed messages.
   */
  query?: string;

  /**
   * Search configuration options
   */
  search_options?: StoreChunkSearchOptions;

  /**
   * Whether to stream the answer
   */
  stream?: boolean;

  /**
   * Additional custom instructions (followed only when not in conflict with existing
   * rules)
   */
  instructions?: string | null;

  /**
   * Question answering configuration options
   */
  qa_options?: StoreQuestionAnsweringParams.QaOptions;
}

export namespace StoreQuestionAnsweringParams {
  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

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
   * IDs or names of stores
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
    | StoreSearchParams.SearchFilterInput
    | Shared.SearchFilterCondition
    | Array<StoreSearchParams.SearchFilterInput | Shared.SearchFilterCondition>
    | null;

  /**
   * Optional list of file IDs to filter chunks by (inclusion filter)
   */
  file_ids?: Array<unknown> | Array<string> | null;

  /**
   * Search query text
   */
  query: string | ContentAPI.ImageURLInput | ContentAPI.TextInput;

  /**
   * Search configuration options
   */
  search_options?: StoreChunkSearchOptions;
}

export namespace StoreSearchParams {
  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface SearchFilterInput {
    /**
     * List of conditions or filters to be ANDed together
     */
    all?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be ORed together
     */
    any?: Array<unknown | Shared.SearchFilterCondition> | null;

    /**
     * List of conditions or filters to be NOTed
     */
    none?: Array<unknown | Shared.SearchFilterCondition> | null;
  }
}

Stores.Files = Files;

export declare namespace Stores {
  export {
    type AgenticSearchConfig as AgenticSearchConfig,
    type AudioChunkGeneratedMetadata as AudioChunkGeneratedMetadata,
    type AudioURL as AudioURL,
    type CodeChunkGeneratedMetadata as CodeChunkGeneratedMetadata,
    type ContextualizationConfig as ContextualizationConfig,
    type ExpiresAfter as ExpiresAfter,
    type FileCounts as FileCounts,
    type ImageChunkGeneratedMetadata as ImageChunkGeneratedMetadata,
    type ImageURLOutput as ImageURLOutput,
    type MarkdownChunkGeneratedMetadata as MarkdownChunkGeneratedMetadata,
    type MarkdownHeading as MarkdownHeading,
    type PdfChunkGeneratedMetadata as PdfChunkGeneratedMetadata,
    type RerankConfig as RerankConfig,
    type ScoredAudioURLInputChunk as ScoredAudioURLInputChunk,
    type ScoredImageURLInputChunk as ScoredImageURLInputChunk,
    type ScoredTextInputChunk as ScoredTextInputChunk,
    type ScoredVideoURLInputChunk as ScoredVideoURLInputChunk,
    type Store as Store,
    type StoreChunkSearchOptions as StoreChunkSearchOptions,
    type StoreConfig as StoreConfig,
    type TextChunkGeneratedMetadata as TextChunkGeneratedMetadata,
    type VideoChunkGeneratedMetadata as VideoChunkGeneratedMetadata,
    type VideoURL as VideoURL,
    type StoreDeleteResponse as StoreDeleteResponse,
    type StoreGrepResponse as StoreGrepResponse,
    type StoreListChunksResponse as StoreListChunksResponse,
    type StoreMetadataFacetsResponse as StoreMetadataFacetsResponse,
    type StoreQuestionAnsweringResponse as StoreQuestionAnsweringResponse,
    type StoreSearchResponse as StoreSearchResponse,
    type StoresCursor as StoresCursor,
    type StoreCreateParams as StoreCreateParams,
    type StoreUpdateParams as StoreUpdateParams,
    type StoreListParams as StoreListParams,
    type StoreGrepParams as StoreGrepParams,
    type StoreListChunksParams as StoreListChunksParams,
    type StoreMetadataFacetsParams as StoreMetadataFacetsParams,
    type StoreQuestionAnsweringParams as StoreQuestionAnsweringParams,
    type StoreSearchParams as StoreSearchParams,
  };

  export {
    Files as Files,
    type AudioURLInputChunk as AudioURLInputChunk,
    type ImageURLInputChunk as ImageURLInputChunk,
    type StoreFile as StoreFile,
    type StoreFileConfig as StoreFileConfig,
    type StoreFileStatus as StoreFileStatus,
    type TextInputChunk as TextInputChunk,
    type VideoURLInputChunk as VideoURLInputChunk,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileCreateParams as FileCreateParams,
    type FileRetrieveParams as FileRetrieveParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
  };
}
