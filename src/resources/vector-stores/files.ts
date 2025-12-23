// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as VectorStoresFilesAPI from './files';
import * as Shared from '../shared';
import * as FilesAPI from '../stores/files';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import * as polling from '../../lib/polling';
import { Uploadable } from '../../uploads';
import { path } from '../../internal/utils/path';

export class Files extends APIResource {
  /**
   * DEPRECATED: Use POST /stores/{store_identifier}/files instead
   *
   * @deprecated Use post stores.files instead
   */
  create(
    vectorStoreIdentifier: string,
    body: FileCreateParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreFile> {
    return this._client.post(path`/v1/vector_stores/${vectorStoreIdentifier}/files`, { body, ...options });
  }

  /**
   * DEPRECATED: Use GET /stores/{store_identifier}/files/{file_id} instead
   *
   * @deprecated Use stores.files instead
   */
  retrieve(
    fileID: string,
    params: FileRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<VectorStoreFile> {
    const { vector_store_identifier, ...query } = params;
    return this._client.get(path`/v1/vector_stores/${vector_store_identifier}/files/${fileID}`, {
      query,
      ...options,
    });
  }

  /**
   * DEPRECATED: Use POST /stores/{store_identifier}/files/list instead
   *
   * @deprecated Use post stores.files.list instead
   */
  list(
    vectorStoreIdentifier: string,
    body: FileListParams,
    options?: RequestOptions,
  ): APIPromise<FileListResponse> {
    return this._client.post(path`/v1/vector_stores/${vectorStoreIdentifier}/files/list`, {
      body,
      ...options,
    });
  }

  /**
   * DEPRECATED: Use DELETE /stores/{store_identifier}/files/{file_id} instead
   *
   * @deprecated Use stores.files instead
   */
  delete(fileID: string, params: FileDeleteParams, options?: RequestOptions): APIPromise<FileDeleteResponse> {
    const { vector_store_identifier } = params;
    return this._client.delete(path`/v1/vector_stores/${vector_store_identifier}/files/${fileID}`, options);
  }

  /**
   * DEPRECATED: Use POST /stores/{store_identifier}/files/search instead
   *
   * @deprecated Use stores.files.search instead
   */
  search(body: FileSearchParams, options?: RequestOptions): APIPromise<FileSearchResponse> {
    return this._client.post('/v1/vector_stores/files/search', { body, ...options });
  }

  /**
   * Poll for a file's processing status until it reaches a terminal state.
   *
   * @param vectorStoreIdentifier - The identifier of the vector store
   * @param fileId - The ID of the file to poll
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async poll(
    vectorStoreIdentifier: string,
    fileId: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const pollingIntervalMs = pollIntervalMs || 500;
    const pollingTimeoutMs = pollTimeoutMs;

    return polling.poll({
      fn: () => this.retrieve(fileId, { vector_store_identifier: vectorStoreIdentifier, ...options }),
      condition: (result) =>
        result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled',
      intervalSeconds: pollingIntervalMs / 1000,
      ...(pollingTimeoutMs && { timeoutSeconds: pollingTimeoutMs / 1000 }),
    });
  }

  /**
   * Create a file in a vector store and wait for it to be processed.
   *
   * @param vectorStoreIdentifier - The identifier of the vector store to upload to
   * @param body - The file creation parameters
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async createAndPoll(
    vectorStoreIdentifier: string,
    body: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const file = await this.create(vectorStoreIdentifier, body, options);
    return this.poll(vectorStoreIdentifier, file.id, pollIntervalMs, pollTimeoutMs, options);
  }

  /**
   * Upload a file to the files API and then create a file in a vector store.
   * Note the file will be asynchronously processed.
   *
   * @param vectorStoreIdentifier - The identifier of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param options - Additional request options
   * @returns The created vector store file
   */
  async upload(
    vectorStoreIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const fileUploadResponse = await this._client.files.create({ file }, options);

    return this.create(
      vectorStoreIdentifier,
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
   * @param vectorStoreIdentifier - The identifier of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The vector store file object once it reaches a terminal state
   */
  async uploadAndPoll(
    vectorStoreIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const vectorStoreFile = await this.upload(vectorStoreIdentifier, file, body, options);
    return this.poll(vectorStoreIdentifier, vectorStoreFile.id, pollIntervalMs, pollTimeoutMs, options);
  }
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

/**
 * Represents a scored store file.
 */
export interface ScoredVectorStoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Name of the file
   */
  filename?: string;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Processing status of the file
   */
  status?: FilesAPI.StoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing store
   */
  vector_store_id: string;

  /**
   * Timestamp of store file creation
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
   * Array of scored file chunks
   */
  chunks: Array<
    | ScoredVectorStoreFile.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk
    | ScoredVectorStoreFile.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk
    | ScoredVectorStoreFile.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk
    | ScoredVectorStoreFile.MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk
  > | null;

  /**
   * score of the file
   */
  score: number;
}

export namespace ScoredVectorStoreFile {
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
    generated_metadata?:
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk.MarkdownChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk.TextChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk.PdfChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk.CodeChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk.AudioChunkGeneratedMetadata
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

  export namespace MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredTextInputChunk {
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }
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
    generated_metadata?:
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.MarkdownChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.TextChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.PdfChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.CodeChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredImageURLInputChunk.AudioChunkGeneratedMetadata
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
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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
    generated_metadata?:
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.MarkdownChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.TextChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.PdfChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.CodeChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredAudioURLInputChunk.AudioChunkGeneratedMetadata
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
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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
    generated_metadata?:
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.MarkdownChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.TextChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.PdfChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.CodeChunkGeneratedMetadata
      | MxbaiOmniAPIRoutesV1DeprecatedVectorStoresModelsScoredVideoURLInputChunk.AudioChunkGeneratedMetadata
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
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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

export type VectorStoreFileStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

/**
 * Represents a file stored in a store.
 */
export interface VectorStoreFile {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Name of the file
   */
  filename?: string;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Processing status of the file
   */
  status?: FilesAPI.StoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing store
   */
  vector_store_id: string;

  /**
   * Timestamp of store file creation
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
   * chunks
   */
  chunks?: Array<
    | VectorStoreFile.TextInputChunk
    | VectorStoreFile.ImageURLInputChunk
    | VectorStoreFile.AudioURLInputChunk
    | VectorStoreFile.VideoURLInputChunk
  > | null;
}

export namespace VectorStoreFile {
  export interface TextInputChunk {
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
      | TextInputChunk.MarkdownChunkGeneratedMetadata
      | TextInputChunk.TextChunkGeneratedMetadata
      | TextInputChunk.PdfChunkGeneratedMetadata
      | TextInputChunk.CodeChunkGeneratedMetadata
      | TextInputChunk.AudioChunkGeneratedMetadata
      | null;

    /**
     * model used for this chunk
     */
    model?: string | null;

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

  export namespace TextInputChunk {
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }
  }

  export interface ImageURLInputChunk {
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
      | ImageURLInputChunk.MarkdownChunkGeneratedMetadata
      | ImageURLInputChunk.TextChunkGeneratedMetadata
      | ImageURLInputChunk.PdfChunkGeneratedMetadata
      | ImageURLInputChunk.CodeChunkGeneratedMetadata
      | ImageURLInputChunk.AudioChunkGeneratedMetadata
      | null;

    /**
     * model used for this chunk
     */
    model?: string | null;

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
    image_url: ImageURLInputChunk.ImageURL;
  }

  export namespace ImageURLInputChunk {
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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

  export interface AudioURLInputChunk {
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
      | AudioURLInputChunk.MarkdownChunkGeneratedMetadata
      | AudioURLInputChunk.TextChunkGeneratedMetadata
      | AudioURLInputChunk.PdfChunkGeneratedMetadata
      | AudioURLInputChunk.CodeChunkGeneratedMetadata
      | AudioURLInputChunk.AudioChunkGeneratedMetadata
      | null;

    /**
     * model used for this chunk
     */
    model?: string | null;

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
    audio_url: AudioURLInputChunk.AudioURL;

    /**
     * The sampling rate of the audio.
     */
    sampling_rate: number;
  }

  export namespace AudioURLInputChunk {
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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

  export interface VideoURLInputChunk {
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
      | VideoURLInputChunk.MarkdownChunkGeneratedMetadata
      | VideoURLInputChunk.TextChunkGeneratedMetadata
      | VideoURLInputChunk.PdfChunkGeneratedMetadata
      | VideoURLInputChunk.CodeChunkGeneratedMetadata
      | VideoURLInputChunk.AudioChunkGeneratedMetadata
      | null;

    /**
     * model used for this chunk
     */
    model?: string | null;

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
    video_url: VideoURLInputChunk.VideoURL;
  }

  export namespace VideoURLInputChunk {
    export interface MarkdownChunkGeneratedMetadata {
      type?: 'markdown';

      file_type?: 'text/markdown';

      language: string;

      word_count: number;

      file_size: number;

      chunk_headings?: Array<MarkdownChunkGeneratedMetadata.ChunkHeading>;

      heading_context?: Array<MarkdownChunkGeneratedMetadata.HeadingContext>;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export namespace MarkdownChunkGeneratedMetadata {
      export interface ChunkHeading {
        level: number;

        text: string;
      }

      export interface HeadingContext {
        level: number;

        text: string;
      }
    }

    export interface TextChunkGeneratedMetadata {
      type?: 'text';

      file_type?: 'text/plain';

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface PdfChunkGeneratedMetadata {
      type?: 'pdf';

      file_type?: 'application/pdf';

      total_pages: number;

      total_size: number;

      [k: string]: unknown;
    }

    export interface CodeChunkGeneratedMetadata {
      type?: 'code';

      file_type: string;

      language: string;

      word_count: number;

      file_size: number;

      start_line?: number;

      num_lines?: number;

      [k: string]: unknown;
    }

    export interface AudioChunkGeneratedMetadata {
      type?: 'audio';

      file_type: string;

      file_size: number;

      total_duration_seconds: number;

      sample_rate: number;

      channels: number;

      audio_format: number;

      [k: string]: unknown;
    }

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

/**
 * List response wrapper for vector store files.
 */
export interface FileListResponse {
  /**
   * Response model for cursor-based pagination.
   */
  pagination: FileListResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of vector store files
   */
  data: Array<VectorStoreFile>;
}

export namespace FileListResponse {
  /**
   * Response model for cursor-based pagination.
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

/**
 * Search response wrapper for vector store files.
 */
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
   * Optional metadata for the file
   */
  metadata?: unknown;

  /**
   * Configuration for adding the file
   */
  config?: FileCreateParams.Config;

  /**
   * External identifier for this file in the store
   */
  external_id?: string | null;

  /**
   * If true, overwrite an existing file with the same external_id
   */
  overwrite?: boolean;

  /**
   * ID of the file to add
   */
  file_id: string;

  /**
   * @deprecated Configuration for a file.
   */
  experimental?: FileCreateParams.Experimental | null;
}

export namespace FileCreateParams {
  /**
   * Configuration for adding the file
   */
  export interface Config {
    /**
     * Strategy for adding the file, this overrides the store-level default
     */
    parsing_strategy?: 'fast' | 'high_quality';
  }

  /**
   * @deprecated Configuration for a file.
   */
  export interface Experimental {
    /**
     * Strategy for adding the file, this overrides the store-level default
     */
    parsing_strategy?: 'fast' | 'high_quality';
  }
}

export interface FileRetrieveParams {
  /**
   * Path param: The ID or name of the vector store
   */
  vector_store_identifier: string;

  /**
   * Query param: Whether to return the chunks for the file
   */
  return_chunks?: boolean;
}

export interface FileListParams {
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
   * Status to filter by
   */
  statuses?: Array<FilesAPI.StoreFileStatus> | null;

  /**
   * Metadata filter to apply to the query
   */
  metadata_filter?:
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
    | null;
}

export interface FileDeleteParams {
  /**
   * The ID or name of the vector store
   */
  vector_store_identifier: string;
}

export interface FileSearchParams {
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
  search_options?: FileSearchParams.SearchOptions;
}

export namespace FileSearchParams {
  /**
   * Search configuration options
   */
  export interface SearchOptions {
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
    agentic?: boolean | SearchOptions.AgenticSearchConfig | null;

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

    /**
     * Whether to apply search rules
     */
    apply_search_rules?: boolean;
  }

  export namespace SearchOptions {
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
}

export declare namespace Files {
  export {
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
