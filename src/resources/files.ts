// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { isRequestOptions } from '../core';
import * as Core from '../core';
import { LimitOffset, type LimitOffsetParams } from '../pagination';
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
  list(
    query?: FileListParams,
    options?: Core.RequestOptions,
  ): Core.PagePromise<FileObjectsLimitOffset, FileObject>;
  list(options?: Core.RequestOptions): Core.PagePromise<FileObjectsLimitOffset, FileObject>;
  list(
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<FileObjectsLimitOffset, FileObject> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList('/v1/files', FileObjectsLimitOffset, { query, ...options });
  }

  /**
   * Delete a specific file by its ID.
   *
   * Args: file_id: The ID of the file to delete.
   *
   * Returns: FileDeleted: The response containing the details of the deleted file.
   */
  delete(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileDeleteResponse> {
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
    return this._client.get(`/v1/files/${fileId}/content`, {
      ...options,
      headers: { Accept: 'application/octet-stream', ...options?.headers },
      __binaryResponse: true,
    });
  }
}

export class FileObjectsLimitOffset extends LimitOffset<FileObject> {}

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
   * Name of the file including extension
   */
  filename: string;

  /**
   * Size of the file in bytes
   */
  bytes: number;

  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * Version of the file
   */
  version: number;

  /**
   * Timestamp when the file was created
   */
  created_at: string;

  /**
   * Timestamp when the file was last updated
   */
  updated_at: string;
}

export interface FileDeleteResponse {
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

export interface FileListParams extends LimitOffsetParams {}

Files.FileObjectsLimitOffset = FileObjectsLimitOffset;

export declare namespace Files {
  export {
    type FileObject as FileObject,
    type FileDeleteResponse as FileDeleteResponse,
    FileObjectsLimitOffset as FileObjectsLimitOffset,
    type FileCreateParams as FileCreateParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
  };
}
