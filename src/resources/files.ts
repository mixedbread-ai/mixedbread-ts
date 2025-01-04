// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { isRequestOptions } from '../core';
import * as Core from '../core';
import { type Response } from '../_shims/index';

export class Files extends APIResource {
  /**
   * Upload a new file.
   *
   * Args: file: The file to upload.
   *
   * Returns: FileResponse: The response containing the details of the uploaded file.
   */
  create(body: FileCreateParams, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.post('/v1/files', Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * Retrieve details of a specific file by its ID.
   *
   * Args: file_id: The ID of the file to retrieve.
   *
   * Returns: FileResponse: The response containing the file details.
   */
  retrieve(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.get(`/v1/files/${fileId}`, options);
  }

  /**
   * Update the details of a specific file.
   *
   * Args: file_id: The ID of the file to update. file: The new details for the file.
   *
   * Returns: FileObject: The updated file details.
   */
  update(fileId: string, body: FileUpdateParams, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.post(`/v1/files/${fileId}`, Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * List all files for the authenticated user.
   *
   * Args: pagination: The pagination options
   *
   * Returns: A list of files belonging to the user.
   */
  list(query?: FileListParams, options?: Core.RequestOptions): Core.APIPromise<FileListResponse>;
  list(options?: Core.RequestOptions): Core.APIPromise<FileListResponse>;
  list(
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileListResponse> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/v1/files', { query, ...options });
  }

  /**
   * Delete a specific file by its ID.
   *
   * Args: file_id: The ID of the file to delete.
   *
   * Returns: FileDeleted: The response containing the details of the deleted file.
   */
  delete(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileDeleted> {
    return this._client.delete(`/v1/files/${fileId}`, options);
  }

  /**
   * Download a specific file by its ID.
   *
   * Args: file_id: The ID of the file to download.
   *
   * Returns: FileStreamResponse: The response containing the file to be downloaded.
   */
  content(fileId: string, options?: Core.RequestOptions): Core.APIPromise<Response> {
    return this._client.get(`/v1/files/${fileId}/content`, { ...options, __binaryResponse: true });
  }
}

export interface FileDeleted {
  /**
   * The ID of the deleted file
   */
  id: string;

  /**
   * Whether the file was deleted
   */
  deleted?: boolean;

  /**
   * The type of the deleted object
   */
  object?: 'file';
}

/**
 * A model representing a file object in the system.
 *
 * This model contains metadata about files stored in the system, including
 * identifiers, size information, and timestamps.
 */
export interface FileObject {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Size of the file in bytes
   */
  bytes: number;

  /**
   * Timestamp when the file was created
   */
  created_at: string;

  /**
   * Name of the file including extension
   */
  filename: string;

  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * Timestamp when the file was last updated
   */
  updated_at: string;

  /**
   * Version of the file
   */
  version: number;
}

export interface FileListResponse {
  /**
   * The list of files
   */
  data: Array<FileObject>;

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
     * Cursor from which to start returning items
     */
    offset?: number;

    /**
     * Total number of items available
     */
    total?: number;
  }
}

export interface FileCreateParams {
  /**
   * The file to upload
   */
  file: Core.Uploadable;
}

export interface FileUpdateParams {
  /**
   * The file to update
   */
  file: Core.Uploadable;
}

export interface FileListParams {
  /**
   * Maximum number of items to return per page
   */
  limit?: number;

  /**
   * Cursor from which to start returning items
   */
  offset?: number;
}

export declare namespace Files {
  export {
    type FileDeleted as FileDeleted,
    type FileObject as FileObject,
    type FileListResponse as FileListResponse,
    type FileCreateParams as FileCreateParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
  };
}
