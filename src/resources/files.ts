// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../core/pagination';
import { type Uploadable } from '../core/uploads';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path } from '../internal/utils/path';

export class Files extends APIResource {
  /**
   * Upload a new file.
   *
   * Args: file: The file to upload.
   *
   * Returns: FileResponse: The response containing the details of the uploaded file.
   */
  create(body: FileCreateParams, options?: RequestOptions): APIPromise<FileObject> {
    return this._client.post('/v1/files', multipartFormRequestOptions({ body, ...options }, this._client));
  }

  /**
   * Retrieve details of a specific file by its ID.
   *
   * Args: file_id: The ID of the file to retrieve.
   *
   * Returns: FileResponse: The response containing the file details.
   */
  retrieve(fileID: string, options?: RequestOptions): APIPromise<FileObject> {
    return this._client.get(path`/v1/files/${fileID}`, options);
  }

  /**
   * Update the details of a specific file.
   *
   * Args: file_id: The ID of the file to update. file: The new details for the file.
   *
   * Returns: FileObject: The updated file details.
   */
  update(fileID: string, body: FileUpdateParams, options?: RequestOptions): APIPromise<FileObject> {
    return this._client.post(
      path`/v1/files/${fileID}`,
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * List all files for the authenticated user.
   *
   * Args: pagination: The pagination options
   *
   * Returns: A list of files belonging to the user.
   */
  list(
    query: FileListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<FileObjectsLimitOffset, FileObject> {
    return this._client.getAPIList('/v1/files', LimitOffset<FileObject>, { query, ...options });
  }

  /**
   * Delete a specific file by its ID.
   *
   * Args: file_id: The ID of the file to delete.
   *
   * Returns: FileDeleted: The response containing the details of the deleted file.
   */
  delete(fileID: string, options?: RequestOptions): APIPromise<FileDeleteResponse> {
    return this._client.delete(path`/v1/files/${fileID}`, options);
  }

  /**
   * Download a specific file by its ID.
   *
   * Args: file_id: The ID of the file to download.
   *
   * Returns: FileStreamResponse: The response containing the file to be downloaded.
   */
  content(fileID: string, options?: RequestOptions): APIPromise<Response> {
    return this._client.get(path`/v1/files/${fileID}/content`, {
      ...options,
      headers: buildHeaders([{ Accept: 'application/octet-stream' }, options?.headers]),
      __binaryResponse: true,
    });
  }
}

export type FileObjectsLimitOffset = LimitOffset<FileObject>;

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
  file: Uploadable;
}

export interface FileUpdateParams {
  /**
   * The file to update
   */
  file: Uploadable;
}

export interface FileListParams extends LimitOffsetParams {}

export declare namespace Files {
  export {
    type FileObject as FileObject,
    type FileDeleteResponse as FileDeleteResponse,
    type FileObjectsLimitOffset as FileObjectsLimitOffset,
    type FileCreateParams as FileCreateParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
  };
}
