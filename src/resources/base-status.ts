// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import * as BaseStatusAPI from './base-status';

export class BaseStatus extends APIResource {
  /**
   * Perform a base search to check the service status and configuration.
   *
   * Args: state: The application state.
   *
   * Returns: dict: A dictionary containing the service status and public
   * configuration details.
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

export namespace BaseStatus {
  export import InfoResponse = BaseStatusAPI.InfoResponse;
}
