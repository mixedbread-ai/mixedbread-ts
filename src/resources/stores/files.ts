// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as VectorStoresFilesAPI from '../vector-stores/files';
import * as VectorStoresAPI from '../vector-stores/vector-stores';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import * as polling from '../../lib/polling';
import { Uploadable } from '../../uploads';
import { path } from '../../internal/utils/path';

export class Files extends APIResource {
  /**
   * Upload a file to a store.
   *
   * Args: store_identifier: The ID or name of the store. file_add_params: The file
   * to add to the store.
   *
   * Returns: VectorStoreFile: The uploaded file details.
   */
  create(storeIdentifier: string, body: FileCreateParams, options?: RequestOptions): APIPromise<StoreFile> {
    return this._client.post(path`/v1/stores/${storeIdentifier}/files`, { body, ...options });
  }

  /**
   * Get a file from a store.
   *
   * Args: store_identifier: The ID or name of the store. file_id: The ID or name of
   * the file. options: Get file options.
   *
   * Returns: VectorStoreFile: The file details.
   */
  retrieve(
    fileIdentifier: string,
    params: FileRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<StoreFile> {
    const { store_identifier, ...query } = params;
    return this._client.get(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, {
      query,
      ...options,
    });
  }

  /**
   * List files indexed in a vector store with pagination and metadata filter.
   *
   * Args: vector_store_identifier: The ID or name of the vector store pagination:
   * Pagination parameters and metadata filter
   *
   * Returns: VectorStoreFileListResponse: Paginated list of vector store files
   */
  list(
    storeIdentifier: string,
    body: FileListParams,
    options?: RequestOptions,
  ): APIPromise<FileListResponse> {
    return this._client.post(path`/v1/stores/${storeIdentifier}/files/list`, { body, ...options });
  }

  /**
   * Delete a file from a store.
   *
   * Args: store_identifier: The ID or name of the store. file_id: The ID or name of
   * the file to delete.
   *
   * Returns: VectorStoreFileDeleted: The deleted file details.
   */
  delete(
    fileIdentifier: string,
    params: FileDeleteParams,
    options?: RequestOptions,
  ): APIPromise<FileDeleteResponse> {
    const { store_identifier } = params;
    return this._client.delete(path`/v1/stores/${store_identifier}/files/${fileIdentifier}`, options);
  }

  /**
   * Search for files within a store based on semantic similarity.
   *
   * Args: store_identifier: The ID or name of the store to search within
   * search_params: Search configuration including query text, pagination, and
   * filters
   *
   * Returns: StoreFileSearchResponse: List of matching files with relevance scores
   */
  search(body: FileSearchParams, options?: RequestOptions): APIPromise<FileSearchResponse> {
    return this._client.post('/v1/stores/files/search', { body, ...options });
  }

  /**
   * Poll for a file's processing status until it reaches a terminal state.
   *
   * Supports both positional arguments (`poll(storeIdentifier, fileIdentifier, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`poll({ storeIdentifier, fileIdentifier, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store when using positional arguments
   * @param fileIdentifier - The ID or external identifier of the file to poll when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Poll configuration when using named parameters
   * @returns The file object once it reaches a terminal state
   */
  async poll(
    storeIdentifier: string,
    fileIdentifier: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  async poll(params: FilePollHelperParams): Promise<StoreFile>;
  async poll(
    storeIdentifierOrParams: string | FilePollHelperParams,
    fileIdentifier?: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile> {
    const params: FilePollHelperParams =
      typeof storeIdentifierOrParams === 'string' ?
        {
          storeIdentifier: storeIdentifierOrParams,
          fileIdentifier: fileIdentifier as string,
          pollIntervalMs,
          pollTimeoutMs,
          options,
        }
      : storeIdentifierOrParams;

    const pollingIntervalMs = params.pollIntervalMs ?? 500;
    const retrieveParams: FileRetrieveParams = {
      store_identifier: params.storeIdentifier,
      ...(params.returnChunks !== undefined && { return_chunks: params.returnChunks }),
    };

    return polling.poll({
      fn: () => this.retrieve(params.fileIdentifier, retrieveParams, params.options),
      condition: (result) =>
        result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled',
      intervalSeconds: pollingIntervalMs / 1000,
      ...(params.pollTimeoutMs && { timeoutSeconds: params.pollTimeoutMs / 1000 }),
    });
  }

  /**
   * Create a file in a vector store and wait for it to be processed.
   *
   * Supports both positional arguments (`createAndPoll(storeIdentifier, body, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`createAndPoll({ storeIdentifier, body, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store to upload to when using positional arguments
   * @param body - The file creation parameters when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Create configuration when using named parameters
   * @returns The file object once it reaches a terminal state
   */
  async createAndPoll(
    storeIdentifier: string,
    body: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  async createAndPoll(params: FileCreateAndPollHelperParams): Promise<StoreFile>;
  async createAndPoll(
    storeIdentifierOrParams: string | FileCreateAndPollHelperParams,
    body?: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile> {
    const params: FileCreateAndPollHelperParams =
      typeof storeIdentifierOrParams === 'string' ?
        {
          storeIdentifier: storeIdentifierOrParams,
          body: body as FileCreateParams,
          pollIntervalMs,
          pollTimeoutMs,
          options,
        }
      : storeIdentifierOrParams;

    const file = await this.create(params.storeIdentifier, params.body, params.options);
    return this.poll({
      storeIdentifier: params.storeIdentifier,
      fileIdentifier: file.id,
      pollIntervalMs: params.pollIntervalMs,
      pollTimeoutMs: params.pollTimeoutMs,
      options: params.options,
      returnChunks: params.returnChunks,
    });
  }

  /**
   * Upload a file to the files API and then create a file in a vector store.
   * Note the file will be asynchronously processed.
   *
   * Supports both positional arguments (`upload(storeIdentifier, file, body, options)`) and a named-parameter object
   * (`upload({ storeIdentifier, file, body, options })`).
   *
   * @param storeIdentifier - The identifier of the store to add the file to when using positional arguments
   * @param file - The file to upload when using positional arguments
   * @param body - Additional parameters for the vector store file when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Upload configuration when using named parameters
   * @returns The created vector store file
   */
  async upload(
    storeIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  async upload(params: FileUploadHelperParams): Promise<StoreFile>;
  async upload(
    storeIdentifierOrParams: string | FileUploadHelperParams,
    file?: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: RequestOptions,
  ): Promise<StoreFile> {
    const params: FileUploadHelperParams =
      typeof storeIdentifierOrParams === 'string' ?
        { storeIdentifier: storeIdentifierOrParams, file: file as Uploadable, body, options }
      : storeIdentifierOrParams;

    const fileUploadResponse = await this._client.files.create({ file: params.file }, params.options);

    return this.create(
      params.storeIdentifier,
      { file_id: fileUploadResponse.id, ...params.body },
      params.options,
    );
  }

  /**
   * Upload a file to files API, create a file in a vector store, and poll until processing is complete.
   *
   * Supports both positional arguments (`uploadAndPoll(storeIdentifier, file, body, pollIntervalMs, pollTimeoutMs, options)`) and
   * a named-parameter object (`uploadAndPoll({ storeIdentifier, file, body, pollIntervalMs, pollTimeoutMs, options })`).
   *
   * @param storeIdentifier - The identifier of the store to add the file to when using positional arguments
   * @param file - The file to upload when using positional arguments
   * @param body - Additional parameters for the vector store file when using positional arguments
   * @param pollIntervalMs - Interval between polls in milliseconds (default: 500) when using positional arguments
   * @param pollTimeoutMs - Maximum time to poll in milliseconds (default: no timeout) when using positional arguments
   * @param options - Additional request options when using positional arguments
   * @param params - Upload and poll configuration when using named parameters
   * @returns The vector store file object once it reaches a terminal state
   */
  async uploadAndPoll(
    storeIdentifier: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile>;
  async uploadAndPoll(params: FileUploadAndPollHelperParams): Promise<StoreFile>;
  async uploadAndPoll(
    storeIdentifierOrParams: string | FileUploadAndPollHelperParams,
    file?: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<StoreFile> {
    const params: FileUploadAndPollHelperParams =
      typeof storeIdentifierOrParams === 'string' ?
        {
          storeIdentifier: storeIdentifierOrParams,
          file: file as Uploadable,
          body,
          pollIntervalMs,
          pollTimeoutMs,
          options,
        }
      : storeIdentifierOrParams;

    const vectorStoreFile = await this.upload({
      storeIdentifier: params.storeIdentifier,
      file: params.file,
      body: params.body,
      options: params.options,
    });

    return this.poll({
      storeIdentifier: params.storeIdentifier,
      fileIdentifier: vectorStoreFile.id,
      pollIntervalMs: params.pollIntervalMs,
      pollTimeoutMs: params.pollTimeoutMs,
      options: params.options,
      returnChunks: params.returnChunks,
    });
  }
}

/**
 * Parameters for polling store file status.
 */
export interface FilePollHelperParams {
  storeIdentifier: string;
  fileIdentifier: string;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
}

/**
 * Parameters for creating and polling a store file.
 */
export interface FileCreateAndPollHelperParams {
  storeIdentifier: string;
  body: FileCreateParams;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
}

/**
 * Parameters for uploading a file to a store.
 */
export interface FileUploadHelperParams {
  storeIdentifier: string;
  file: Uploadable;
  body?: Omit<FileCreateParams, 'file_id'> | undefined;
  options?: RequestOptions | undefined;
}

/**
 * Parameters for uploading and polling a store file.
 */
export interface FileUploadAndPollHelperParams {
  storeIdentifier: string;
  file: Uploadable;
  body?: Omit<FileCreateParams, 'file_id'> | undefined;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
  returnChunks?: boolean | undefined;
}

/**
 * Represents a scored store file.
 */
export interface ScoredStoreFile {
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
   * External identifier for this file in the store
   */
  external_id?: string | null;

  /**
   * Processing status of the file
   */
  status?: StoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing store
   */
  store_id: string;

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
   * Storage usage in tokens
   */
  usage_tokens?: number | null;

  /**
   * Configuration for a file.
   */
  config?: ScoredStoreFile.Config | null;

  /**
   * Type of the object
   */
  object?: 'store.file';

  /**
   * Array of scored file chunks
   */
  chunks: Array<
    | VectorStoresAPI.ScoredTextInputChunk
    | VectorStoresAPI.ScoredImageURLInputChunk
    | VectorStoresAPI.ScoredAudioURLInputChunk
    | VectorStoresAPI.ScoredVideoURLInputChunk
  > | null;

  /**
   * score of the file
   */
  score: number;
}

export namespace ScoredStoreFile {
  /**
   * Configuration for a file.
   */
  export interface Config {
    /**
     * Strategy for adding the file, this overrides the store-level default
     */
    parsing_strategy?: 'fast' | 'high_quality';
  }
}

export type StoreFileStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

/**
 * Represents a file stored in a store.
 */
export interface StoreFile {
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
   * External identifier for this file in the store
   */
  external_id?: string | null;

  /**
   * Processing status of the file
   */
  status?: StoreFileStatus;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing store
   */
  store_id: string;

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
   * Storage usage in tokens
   */
  usage_tokens?: number | null;

  /**
   * Configuration for a file.
   */
  config?: StoreFile.Config | null;

  /**
   * Type of the object
   */
  object?: 'store.file';

  /**
   * chunks
   */
  chunks?: Array<
    | StoreFile.TextInputChunk
    | StoreFile.ImageURLInputChunk
    | StoreFile.AudioURLInputChunk
    | StoreFile.VideoURLInputChunk
  > | null;
}

export namespace StoreFile {
  /**
   * Configuration for a file.
   */
  export interface Config {
    /**
     * Strategy for adding the file, this overrides the store-level default
     */
    parsing_strategy?: 'fast' | 'high_quality';
  }

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
   * The list of store files
   */
  data: Array<StoreFile>;
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
  object?: 'store.file';
}

export interface FileSearchResponse {
  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The list of scored store files
   */
  data: Array<ScoredStoreFile>;
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
   * Path param: The ID or name of the store
   */
  store_identifier: string;

  /**
   * Query param: Whether to return the chunks for the file. If a list of integers is
   * provided, only the chunks at the specified indices will be returned.
   */
  return_chunks?: boolean | Array<number>;
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
  statuses?: Array<StoreFileStatus> | null;

  /**
   * Metadata filter to apply to the query
   */
  metadata_filter?:
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
    | null;

  /**
   * Search query for fuzzy matching over name and description fields
   */
  q?: string | null;
}

export interface FileDeleteParams {
  /**
   * The ID or name of the store
   */
  store_identifier: string;
}

export interface FileSearchParams {
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
     * Whether to rewrite the query
     */
    rewrite_query?: boolean;

    /**
     * Whether to rerank results and optional reranking configuration
     */
    rerank?: boolean | VectorStoresFilesAPI.RerankConfig | null;

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
}

export declare namespace Files {
  export {
    type ScoredStoreFile as ScoredStoreFile,
    type StoreFileStatus as StoreFileStatus,
    type StoreFile as StoreFile,
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
