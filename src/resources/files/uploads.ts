// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FilesAPI from './files';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Uploads extends APIResource {
  /**
   * Initiate a multipart upload and receive presigned URLs for uploading parts
   * directly to storage.
   */
  create(body: UploadCreateParams, options?: RequestOptions): APIPromise<UploadCreateResponse> {
    return this._client.post('/v1/files/uploads', { body, ...options });
  }

  /**
   * Get a multipart upload's details with fresh presigned URLs for any parts not yet
   * uploaded.
   */
  retrieve(uploadID: string, options?: RequestOptions): APIPromise<UploadRetrieveResponse> {
    return this._client.get(path`/v1/files/uploads/${uploadID}`, options);
  }

  /**
   * List all in-progress multipart uploads for the authenticated organization.
   */
  list(options?: RequestOptions): APIPromise<UploadListResponse> {
    return this._client.get('/v1/files/uploads', options);
  }

  /**
   * Abort a multipart upload and clean up any uploaded parts.
   */
  abort(uploadID: string, options?: RequestOptions): APIPromise<UploadAbortResponse> {
    return this._client.post(path`/v1/files/uploads/${uploadID}/abort`, options);
  }

  /**
   * Complete a multipart upload after all parts have been uploaded. Creates the file
   * object and returns it.
   */
  complete(
    uploadID: string,
    body: UploadCompleteParams,
    options?: RequestOptions,
  ): APIPromise<FilesAPI.FileObject> {
    return this._client.post(path`/v1/files/uploads/${uploadID}/complete`, { body, ...options });
  }
}

export interface MultipartUploadPart {
  /**
   * 1-based part number
   */
  part_number: number;

  /**
   * ETag returned by the storage backend after uploading the part
   */
  etag: string;
}

export interface MultipartUploadPartURL {
  /**
   * 1-based part number
   */
  part_number: number;

  /**
   * Presigned URL for uploading this part
   */
  url: string;
}

export interface UploadCreateResponse {
  /**
   * The multipart upload ID (use this to complete or abort)
   */
  id: string;

  /**
   * Presigned URLs for uploading parts
   */
  part_urls: Array<MultipartUploadPartURL>;
}

export interface UploadRetrieveResponse {
  /**
   * The multipart upload record ID
   */
  id: string;

  /**
   * Original filename
   */
  filename: string;

  /**
   * Total file size in bytes
   */
  file_size: number;

  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * Number of parts the file was split into
   */
  part_count: number;

  /**
   * When the upload was initiated
   */
  created_at: string;

  /**
   * Parts that have already been uploaded
   */
  completed_parts: Array<MultipartUploadPart>;

  /**
   * Presigned URLs for the parts that still need to be uploaded
   */
  part_urls: Array<MultipartUploadPartURL>;
}

export interface UploadListResponse {
  /**
   * List of in-progress multipart uploads
   */
  data: Array<UploadListResponse.Data>;
}

export namespace UploadListResponse {
  export interface Data {
    /**
     * The multipart upload record ID
     */
    id: string;

    /**
     * Original filename
     */
    filename: string;

    /**
     * Total file size in bytes
     */
    file_size: number;

    /**
     * MIME type of the file
     */
    mime_type: string;

    /**
     * Number of parts the file was split into
     */
    part_count: number;

    /**
     * When the upload was initiated
     */
    created_at: string;
  }
}

export interface UploadAbortResponse {
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

export interface UploadCreateParams {
  /**
   * Name of the file including extension
   */
  filename: string;

  /**
   * Total size of the file in bytes
   */
  file_size: number;

  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * Number of parts to split the upload into
   */
  part_count?: number;
}

export interface UploadCompleteParams {
  /**
   * List of completed parts with their ETags
   */
  parts: Array<MultipartUploadPart>;
}

export declare namespace Uploads {
  export {
    type MultipartUploadPart as MultipartUploadPart,
    type MultipartUploadPartURL as MultipartUploadPartURL,
    type UploadCreateResponse as UploadCreateResponse,
    type UploadRetrieveResponse as UploadRetrieveResponse,
    type UploadListResponse as UploadListResponse,
    type UploadAbortResponse as UploadAbortResponse,
    type UploadCreateParams as UploadCreateParams,
    type UploadCompleteParams as UploadCompleteParams,
  };
}
