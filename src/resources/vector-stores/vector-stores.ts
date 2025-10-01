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
import { Cursor, type CursorParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class VectorStores extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);

  /**
   * DEPRECATED: Use POST /stores instead
   *
   * @deprecated
   */
  create(body: VectorStoreCreateParams, options?: RequestOptions): APIPromise<VectorStore> {
    return this._client.post('/v1/vector_stores', { body, ...options });
  }

  /**
   * DEPRECATED: Use GET /stores/{store_identifier} instead
   *
   * @deprecated
   */
  retrieve(vectorStoreIdentifier: string, options?: RequestOptions): APIPromise<VectorStore> {
    return this._client.get(path`/v1/vector_stores/${vectorStoreIdentifier}`, options);
  }

  /**
   * DEPRECATED: Use PUT /stores/{store_identifier} instead
   *
   * @deprecated
   */
  update(
    vectorStoreIdentifier: string,
    body: VectorStoreUpdateParams,
    options?: RequestOptions,
  ): APIPromise<VectorStore> {
    return this._client.put(path`/v1/vector_stores/${vectorStoreIdentifier}`, { body, ...options });
  }

  /**
   * DEPRECATED: Use GET /stores instead
   *
   * @deprecated
   */
  list(
    query: VectorStoreListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<VectorStoresCursor, VectorStore> {
    return this._client.getAPIList('/v1/vector_stores', Cursor<VectorStore>, { query, ...options });
  }

  /**
   * DEPRECATED: Use DELETE /stores/{store_identifier} instead
   *
   * @deprecated
   */
  delete(vectorStoreIdentifier: string, options?: RequestOptions): APIPromise<VectorStoreDeleteResponse> {
    return this._client.delete(path`/v1/vector_stores/${vectorStoreIdentifier}`, options);
  }

  /**
   * DEPRECATED: Use POST /stores/question-answering instead
   *
   * @deprecated
   */
  questionAnswering(
    body: VectorStoreQuestionAnsweringParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreQuestionAnsweringResponse> {
    return this._client.post('/v1/vector_stores/question-answering', { body, ...options });
  }

  /**
   * DEPRECATED: Use POST /stores/search instead
   *
   * @deprecated
   */
  search(body: VectorStoreSearchParams, options?: RequestOptions): APIPromise<VectorStoreSearchResponse> {
    return this._client.post('/v1/vector_stores/search', { body, ...options });
  }
}

export type VectorStoresCursor = Cursor<VectorStore>;

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
   * store id
   */
  store_id: string;

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
   * The audio input specification.
   */
  audio_url: ScoredAudioURLInputChunk.AudioURL;

  /**
   * The sampling rate of the audio.
   */
  sampling_rate: number;
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
   * store id
   */
  store_id: string;

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
   * The image input specification.
   */
  image_url: ScoredImageURLInputChunk.ImageURL;
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
   * store id
   */
  store_id: string;

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
   * store id
   */
  store_id: string;

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
   * The video input specification.
   */
  video_url: ScoredVideoURLInputChunk.VideoURL;
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
   * Represents an expiration policy for a store.
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

  /**
   * Whether to apply search rules
   */
  apply_search_rules?: boolean;
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
    | VectorStoreQuestionAnsweringResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk
    | VectorStoreQuestionAnsweringResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk
    | VectorStoreQuestionAnsweringResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk
    | VectorStoreQuestionAnsweringResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk
  >;
}

export namespace VectorStoreQuestionAnsweringResponse {
  /**
   * Scored text chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk {
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
     * store id
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
     * The offset of the text in the file relative to the start of the file.
     */
    offset?: number;

    /**
     * Text content to process
     */
    text: string;
  }

  /**
   * Scored image chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk {
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
     * store id
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
     * ocr text of the image
     */
    ocr_text?: string | null;

    /**
     * summary of the image
     */
    summary?: string | null;

    /**
     * The image input specification.
     */
    image_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.ImageURL;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk {
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

  /**
   * Scored audio chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk {
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
     * store id
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
     * speech recognition (sr) text of the audio
     */
    transcription?: string | null;

    /**
     * summary of the audio
     */
    summary?: string | null;

    /**
     * The audio input specification.
     */
    audio_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.AudioURL;

    /**
     * The sampling rate of the audio.
     */
    sampling_rate: number;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk {
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

  /**
   * Scored video chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk {
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
     * store id
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
     * speech recognition (sr) text of the video
     */
    transcription?: string | null;

    /**
     * summary of the video
     */
    summary?: string | null;

    /**
     * The video input specification.
     */
    video_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.VideoURL;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk {
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
    | VectorStoreSearchResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk
    | VectorStoreSearchResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk
    | VectorStoreSearchResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk
    | VectorStoreSearchResponse.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk
  >;
}

export namespace VectorStoreSearchResponse {
  /**
   * Scored text chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk {
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
     * store id
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
     * The offset of the text in the file relative to the start of the file.
     */
    offset?: number;

    /**
     * Text content to process
     */
    text: string;
  }

  /**
   * Scored image chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk {
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
     * store id
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
     * ocr text of the image
     */
    ocr_text?: string | null;

    /**
     * summary of the image
     */
    summary?: string | null;

    /**
     * The image input specification.
     */
    image_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.ImageURL;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk {
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

  /**
   * Scored audio chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk {
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
     * store id
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
     * speech recognition (sr) text of the audio
     */
    transcription?: string | null;

    /**
     * summary of the audio
     */
    summary?: string | null;

    /**
     * The audio input specification.
     */
    audio_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.AudioURL;

    /**
     * The sampling rate of the audio.
     */
    sampling_rate: number;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk {
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

  /**
   * Scored video chunk for deprecated API.
   */
  export interface MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk {
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
     * store id
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
     * speech recognition (sr) text of the video
     */
    transcription?: string | null;

    /**
     * summary of the video
     */
    summary?: string | null;

    /**
     * The video input specification.
     */
    video_url: MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.VideoURL;
  }

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk {
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
   * Represents an expiration policy for a store.
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
   * New name for the store
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
   * Represents an expiration policy for a store.
   */
  expires_after?: ExpiresAfter | null;

  /**
   * Optional metadata key-value pairs
   */
  metadata?: unknown;
}

export interface VectorStoreListParams extends CursorParams {
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
  vector_store_identifiers: Array<string>;

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
  vector_store_identifiers: Array<string>;

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
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreQuestionAnsweringResponse as VectorStoreQuestionAnsweringResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    type VectorStoresCursor as VectorStoresCursor,
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
