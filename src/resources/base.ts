// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class Base extends APIResource {
  /**
   * Perform a base search to check the service status and configuration.
   *
   * Args: state: The application state.
   *
   * Returns: dict: A dictionary containing the service status and public
   * configuration details.
   */
  status(options?: Core.RequestOptions): Core.APIPromise<BaseStatusResponse> {
    return this._client.get('/', options);
  }
}

/**
 * Info Pydantic Response Service Message
 */
export interface BaseStatusResponse {
  name: string;

  version: string;
}

export declare namespace Base {
  export { type BaseStatusResponse as BaseStatusResponse };
}
