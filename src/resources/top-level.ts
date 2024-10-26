// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as TopLevelAPI from './top-level';

/**
 * Info Pydantic Response Service Message
 */
export interface BaseStatusCheckResponse {
  name: string;

  version: string;
}

export namespace TopLevel {
  export import BaseStatusCheckResponse = TopLevelAPI.BaseStatusCheckResponse;
}
