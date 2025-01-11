// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class ServiceInfo extends APIResource {
  /**
   * Returns service information, including name and version.
   *
   * Returns: InfoResponse: A response containing the service name and version.
   */
  retrieve(options?: Core.RequestOptions): Core.APIPromise<InfoResponse> {
    return this._client.get('/', options);
  }
}

/**
 * Info Pydantic Response Service Message
 */
export interface InfoResponse {
  name: string;

  version: string;
}

export declare namespace ServiceInfo {
  export { type InfoResponse as InfoResponse };
}
