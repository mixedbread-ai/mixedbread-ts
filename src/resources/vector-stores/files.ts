// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as FilesAPI from '../files/files';

export class Files extends APIResource {
  /**
   * Upload a new file to a vector store for indexing.
   *
   * Args: vector_store_id: The ID of the vector store to upload to file: The file to
   * upload and index
   *
   * Returns: VectorStoreFile: Details of the uploaded and indexed file
   */
  create(
    vectorStoreId: string,
    body: FileCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreFile> {
    return this._client.post(`/v1/vector_stores/${vectorStoreId}/files`, { body, ...options });
  }

  /**
   * Get details of a specific file in a vector store.
   *
   * Args: vector_store_id: The ID of the vector store file_id: The ID of the file
   *
   * Returns: VectorStoreFile: Details of the vector store file
   */
  retrieve(
    vectorStoreId: string,
    fileId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreFile> {
    return this._client.get(`/v1/vector_stores/${vectorStoreId}/files/${fileId}`, options);
  }

  /**
   * List files indexed in a vector store with pagination.
   *
   * Args: vector_store_id: The ID of the vector store pagination: Pagination
   * parameters
   *
   * Returns: VectorStoreFileListResponse: Paginated list of vector store files
   */
  list(
    vectorStoreId: string,
    query?: FileListParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileListResponse>;
  list(vectorStoreId: string, options?: Core.RequestOptions): Core.APIPromise<FileListResponse>;
  list(
    vectorStoreId: string,
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileListResponse> {
    if (isRequestOptions(query)) {
      return this.list(vectorStoreId, {}, query);
    }
    return this._client.get(`/v1/vector_stores/${vectorStoreId}/files`, { query, ...options });
  }

  /**
   * Delete a file from a vector store.
   *
   * Args: vector_store_id: The ID of the vector store file_id: The ID of the file to
   * delete
   *
   * Returns: VectorStoreFileDeleted: The deleted file
   */
  delete(
    vectorStoreId: string,
    fileId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreFileDeleted> {
    return this._client.delete(`/v1/vector_stores/${vectorStoreId}/files/${fileId}`, options);
  }

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
  search(body: FileSearchParams, options?: Core.RequestOptions): Core.APIPromise<FileSearchResponse> {
    return this._client.post('/v1/vector_stores/files/search', { body, ...options });
  }
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
   * Timestamp of vector store file creation
   */
  created_at: string;

  /**
   * ID of the containing vector store
   */
  vector_store_id: string;

  /**
   * List of error messages if processing failed
   */
  errors?: Array<string> | null;

  /**
   * A model representing a file object in the system.
   *
   * This model contains metadata about files stored in the system, including
   * identifiers, size information, and timestamps.
   */
  file_object?: FilesAPI.FileObject | null;

  /**
   * Optional file metadata
   */
  metadata?: unknown;

  /**
   * Type of the object
   */
  object?: 'vector_store.file';

  /**
   * Processing status of the file
   */
  status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

  /**
   * Storage usage in bytes
   */
  usage_bytes?: number | null;

  /**
   * Version number of the file
   */
  version?: number | null;
}

/**
 * Response model for file deletion.
 */
export interface VectorStoreFileDeleted {
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

export interface FileListResponse {
  /**
   * The list of vector store files
   */
  data: Array<VectorStoreFile>;

  /**
   * Pagination model that includes total count of items.
   */
  pagination: FileListResponse.Pagination;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace FileListResponse {
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

export interface FileSearchResponse {
  /**
   * The list of scored vector store files
   */
  data: Array<FileSearchResponse.Data>;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace FileSearchResponse {
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
    metadata?: unknown;
  }

  export namespace Data {
    export interface Chunk {
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
}

export interface FileCreateParams {
  /**
   * ID of the file to add
   */
  file_id: string;

  /**
   * Optional metadata for the file
   */
  metadata?: unknown;
}

export interface FileListParams {
  /**
   * Maximum number of items to return per page
   */
  limit?: number;

  /**
   * Offset of the first item to return
   */
  offset?: number;
}

export interface FileSearchParams {
  /**
   * Search query text
   */
  query: string;

  /**
   * IDs of vector stores to search
   */
  vector_store_ids: Array<string>;

  /**
   * Search configuration options
   */
  search_options?: FileSearchParams.SearchOptions;

  /**
   * Number of results to return
   */
  top_k?: number;
}

export namespace FileSearchParams {
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

export declare namespace Files {
  export {
    type VectorStoreFile as VectorStoreFile,
    type VectorStoreFileDeleted as VectorStoreFileDeleted,
    type FileListResponse as FileListResponse,
    type FileSearchResponse as FileSearchResponse,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
    type FileSearchParams as FileSearchParams,
  };
}
