// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { isRequestOptions } from '../core';
import * as Core from '../core';
import * as FilesAPI from './files';
import { type Response } from '../_shims/index';

export class Files extends APIResource {
  /**
   * Upload a new file.
   *
   * Args: file: The file to upload. state: The application state.
   *
   * Returns: FileResponse: The response containing the details of the uploaded file.
   */
  create(body: FileCreateParams, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.post('/v1/files', Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * Retrieve details of a specific file by its ID.
   *
   * Args: file_id: The ID of the file to retrieve. state: The application state.
   *
   * Returns: FileResponse: The response containing the file details.
   */
  retrieve(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.get(`/v1/files/${fileId}`, options);
  }

  /**
   * Update the details of a specific file.
   *
   * Args: file_id: The ID of the file to update. file_update: The new details for
   * the file. state: The application state.
   *
   * Returns: FileObject: The updated file details.
   */
  update(fileId: string, body: FileUpdateParams, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.put(`/v1/files/${fileId}`, {
      body,
      ...options,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...options?.headers },
    });
  }

  /**
   * List all files for the authenticated user.
   *
   * Args: state: The application state.
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
   * Args: file_id: The ID of the file to delete. state: The application state.
   *
   * Returns: FileDeleted: The response containing the details of the deleted file.
   */
  delete(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.delete(`/v1/files/${fileId}`, options);
  }

  /**
   * Download a specific file by its ID.
   *
   * Args: file_id: The ID of the file to download. state: The application state.
   *
   * Returns: FileStreamResponse: The response containing the file to be downloaded.
   */
  content(fileId: string, options?: Core.RequestOptions): Core.APIPromise<Response> {
    return this._client.get(`/v1/files/${fileId}/content`, { ...options, __binaryResponse: true });
  }
}

/**
 * Model for storing file metadata associated with users.
 */
export interface FileObject {
  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * Name of the file
   */
  name: string;

  /**
   * Size of the file in bytes
   */
  size: number;

  /**
   * Unique identifier for the record
   */
  id?: string;

  /**
   * Timestamp of record creation
   */
  created_at?: string;

  /**
   * Timestamp of last record update
   */
  updated_at?: string;
}

export interface FileListResponse {
  data: Array<FileObject>;

  pagination: FileListResponse.Pagination;
}

export namespace FileListResponse {
  export interface Pagination {
    total: number;

    /**
     * The cursor after which to paginate
     */
    after?: string | null;

    /**
     * The maximum number of items to return
     */
    limit?: number;
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
   * The cursor after which to paginate
   */
  after?: string | null;

  /**
   * The maximum number of items to return
   */
  limit?: number;
}

export namespace Files {
  export import FileObject = FilesAPI.FileObject;
  export import FileListResponse = FilesAPI.FileListResponse;
  export import FileCreateParams = FilesAPI.FileCreateParams;
  export import FileUpdateParams = FilesAPI.FileUpdateParams;
  export import FileListParams = FilesAPI.FileListParams;
}
