// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as FilesAPI from './files';
import * as ContentAPI from './content';

export class Files extends APIResource {
  content: ContentAPI.Content = new ContentAPI.Content(this._client);

  /**
   * Upload new files or update existing ones.
   *
   * Args: file_upload: FileUploadRequest object containing the files and their
   * purposes. state: The application state.
   *
   * Returns: FileResponse: The response containing the details of the uploaded
   * files.
   */
  create(body: FileCreateParams, options?: Core.RequestOptions): Core.APIPromise<FileResponse> {
    return this._client.post('/v1/files', {
      body,
      ...options,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...options?.headers },
    });
  }

  /**
   * Retrieve details of a specific file by its ID.
   *
   * Args: file_id: The ID of the file to retrieve. state: The application state.
   *
   * Returns: FileResponse: The response containing the file details.
   */
  retrieve(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileResponse> {
    return this._client.get(`/v1/files/${fileId}`, options);
  }

  /**
   * Update the details of a specific file.
   *
   * Args: file_id: The ID of the file to update. file_update: The new details for
   * the file. state: The application state.
   *
   * Returns: FileResponse: The response containing the updated file details.
   */
  update(
    fileId: string,
    body: FileUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<FileUpdateResponse> {
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
  list(options?: Core.RequestOptions): Core.APIPromise<FileListResponse> {
    return this._client.get('/v1/files', options);
  }

  /**
   * Delete a specific file by its ID.
   *
   * Args: file_name: The name of the file to delete. state: The application state.
   *
   * Returns: None
   */
  delete(fileId: string, options?: Core.RequestOptions): Core.APIPromise<void> {
    return this._client.delete(`/v1/files/${fileId}`, {
      ...options,
      headers: { Accept: '*/*', ...options?.headers },
    });
  }
}

export interface FileListResponse {
  data: Array<FileListResponse.Data>;

  pagination: FileListResponse.Pagination;
}

export namespace FileListResponse {
  /**
   * Model for storing file metadata associated with users.
   */
  export interface Data {
    mime_type: string;

    name: string;

    size: number;

    user_id: string;

    id?: string;

    created_at?: string;

    updated_at?: string;
  }

  export interface Pagination {
    total: number;

    limit?: number;

    offset?: number;
  }
}

export interface FileResponse {
  data: Array<FileResponse.StoredFile | FileResponse.ErrorAsValue>;
}

export namespace FileResponse {
  /**
   * Model for storing file metadata associated with users.
   */
  export interface StoredFile {
    mime_type: string;

    name: string;

    size: number;

    user_id: string;

    id?: string;

    created_at?: string;

    updated_at?: string;
  }

  /**
   * Represents an error as a value object, useful for returning errors in a
   * structured way. This allows for consistent error handling and serialization
   * across the application.
   */
  export interface ErrorAsValue {
    /**
     * Additional error details
     */
    detail?: unknown;

    /**
     * String representation of additional error details
     */
    detail_str?: string | null;

    /**
     * The error message
     */
    message?: string;
  }
}

export interface FileUpdateResponse {
  /**
   * Model for storing file metadata associated with users.
   */
  data: FileUpdateResponse.Data;
}

export namespace FileUpdateResponse {
  /**
   * Model for storing file metadata associated with users.
   */
  export interface Data {
    mime_type: string;

    name: string;

    size: number;

    user_id: string;

    id?: string;

    created_at?: string;

    updated_at?: string;
  }
}

export interface FileCreateParams {
  /**
   * The files to upload
   */
  files: Array<Core.Uploadable>;
}

export interface FileUpdateParams {
  /**
   * The file to update
   */
  file: Core.Uploadable;
}

export namespace Files {
  export import FileListResponse = FilesAPI.FileListResponse;
  export import FileResponse = FilesAPI.FileResponse;
  export import FileUpdateResponse = FilesAPI.FileUpdateResponse;
  export import FileCreateParams = FilesAPI.FileCreateParams;
  export import FileUpdateParams = FilesAPI.FileUpdateParams;
  export import Content = ContentAPI.Content;
  export import ContentRetrieveResponse = ContentAPI.ContentRetrieveResponse;
}
