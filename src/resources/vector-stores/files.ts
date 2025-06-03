// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as VectorStoresAPI from './vector-stores';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import * as polling from '../../lib/polling';
import { Uploadable } from '../../uploads';

export class Files extends APIResource {
  /**
   * Perform semantic search across complete vector store files.
   *
   * This endpoint searches through vector store files using semantic similarity
   * matching. Unlike chunk search, it returns complete matching files rather than
   * individual chunks. Supports complex search queries with filters and returns
   * relevance-scored results.
   *
   * Args: search_params: Search configuration including: - query text or
   * embeddings - metadata filters - pagination parameters - sorting preferences
   * \_state: API state dependency \_ctx: Service context dependency
   *
   * Returns: VectorStoreSearchFileResponse containing: - List of matched files with
   * relevance scores - Pagination details including total result count
   *
   * Raises: HTTPException (400): If search parameters are invalid HTTPException
   * (404): If no vector stores are found to search
   */
  search(body: FileSearchParams, options?: RequestOptions): APIPromise<FileSearchResponse> {
    return this._client.post('/v1/vector_stores/files/search', { body, ...options });
  }

  /**
   * Poll for a file's processing status until it reaches a terminal state.
   *
   * @param vectorStoreId - The ID of the vector store
   * @param fileId - The ID of the file to poll
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async poll(
    vectorStoreId: string,
    fileId: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const pollingIntervalMs = pollIntervalMs || 500;
    const pollingTimeoutMs = pollTimeoutMs;

    return polling.poll({
      fn: () => this.retrieve(fileId, { vector_store_id: vectorStoreId, ...options }),
      condition: (result) =>
        result.status === 'completed' || result.status === 'failed' || result.status === 'error',
      intervalSeconds: pollingIntervalMs / 1000,
      ...(pollingTimeoutMs && { timeoutSeconds: pollingTimeoutMs / 1000 }),
    });
  }

  /**
   * Create a file in a vector store and wait for it to be processed.
   *
   * @param vectorStoreId - The ID of the vector store to upload to
   * @param body - The file creation parameters
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The file object once it reaches a terminal state
   */
  async createAndPoll(
    vectorStoreId: string,
    body: FileCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const file = await this.create(vectorStoreId, body, options);
    return this.poll(vectorStoreId, file.id, pollIntervalMs, pollTimeoutMs, options);
  }

  /**
   * Upload a file to the files API and then create a file in a vector store.
   * Note the file will be asynchronously processed.
   *
   * @param vectorStoreId - The ID of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param options - Additional request options
   * @returns The created vector store file
   */
  async upload(
    vectorStoreId: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const fileUploadResponse = await this._client.files.create({ file }, options);

    return this.create(
      vectorStoreId,
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
   * @param vectorStoreId - The ID of the vector store to add the file to
   * @param file - The file to upload
   * @param body - Additional parameters for the vector store file
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   * @returns The vector store file object once it reaches a terminal state
   */
  async uploadAndPoll(
    vectorStoreId: string,
    file: Uploadable,
    body?: Omit<FileCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<VectorStoreFile> {
    const vectorStoreFile = await this.upload(vectorStoreId, file, body, options);
    return this.poll(vectorStoreId, vectorStoreFile.id, pollIntervalMs, pollTimeoutMs, options);
  }
}

/**
 * Represents a scored file stored in a vector store.
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
  status?: string;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Timestamp of vector store file creation
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
   * score of the file
   */
  score: number;

  /**
   * chunks
   */
  chunks: Array<
    | VectorStoresAPI.ScoredTextInputChunk
    | VectorStoresAPI.ScoredImageURLInputChunk
    | VectorStoresAPI.ScoredAudioURLInputChunk
    | VectorStoresAPI.ScoredVideoURLInputChunk
  > | null;
}

/**
 * Represents a file stored in a vector store.
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
  status?: string;

  /**
   * Last error message if processing failed
   */
  last_error?: unknown;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * Timestamp of vector store file creation
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
}

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

export interface FileSearchParams {
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
    rerank?: boolean | SearchOptions.RerankConfig | null;

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

  export namespace SearchOptions {
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
  }
}

export declare namespace Files {
  export {
    type ScoredVectorStoreFile as ScoredVectorStoreFile,
    type VectorStoreFile as VectorStoreFile,
    type FileSearchResponse as FileSearchResponse,
    type FileSearchParams as FileSearchParams,
  };
}
