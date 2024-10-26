// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import { type Response } from '../../_shims/index';

export class Content extends APIResource {
  /**
   * Download a specific file by its ID.
   *
   * Args: file_id: The ID of the file to download. state: The application state.
   *
   * Returns: FileStreamResponse: The response containing the file to be downloaded.
   */
  retrieve(fileId: string, options?: Core.RequestOptions): Core.APIPromise<Response> {
    return this._client.get(`/v1/files/${fileId}/content`, { ...options, __binaryResponse: true });
  }
}
