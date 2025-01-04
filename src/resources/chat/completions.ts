// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';

export class Completions extends APIResource {
  /**
   * Create a chat completion using the provided parameters.
   *
   * Generates a completion response based on the chat messages and model parameters
   * provided. The response can be either a full completion or streamed chunks
   * depending on the request parameters.
   *
   * Args: params: Parameters for creating the chat completion including messages,
   * model selection, and generation settings user: The authenticated user making the
   * request
   *
   * Returns: Either a ChatCompletion containing the full response, or
   * ChatCompletionChunk for streaming
   *
   * Raises: HTTPException: If there is an error creating the completion (500)
   */
  create(options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/v1/chat/completions', options);
  }
}

export type CompletionCreateResponse = unknown;

export declare namespace Completions {
  export { type CompletionCreateResponse as CompletionCreateResponse };
}
