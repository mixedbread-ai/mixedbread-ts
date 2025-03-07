// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';

export class Content extends APIResource {
  /**
   * Extract content from a string using the provided schema.
   *
   * Args: params: The parameters for extracting content from a string.
   *
   * Returns: The extracted content.
   */
  create(body: ContentCreateParams, options?: Core.RequestOptions): Core.APIPromise<ExtractionResult> {
    return this._client.post('/v1/extractions/content', { body, ...options });
  }
}

/**
 * The result of an extraction job.
 */
export interface ExtractionResult {
  data: unknown;

  warnings: Array<string>;
}

export interface ContentCreateParams {
  /**
   * The content to extract from
   */
  content: string;

  /**
   * The JSON schema to use for extraction
   */
  json_schema: unknown;
}

export declare namespace Content {
  export { type ExtractionResult as ExtractionResult, type ContentCreateParams as ContentCreateParams };
}
