// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import * as TopLevelAPI from './top-level';

export class Embeddings extends APIResource {
  /**
   * Create embeddings for text or images using the specified model, encoding format,
   * and normalization.
   *
   * Args: params: The parameters for creating embeddings.
   *
   * Returns: EmbeddingCreateResponse: The response containing the embeddings.
   */
  create(
    body: EmbeddingCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<TopLevelAPI.EmbeddingCreateResponse> {
    return this._client.post('/v1/embeddings', { body, ...options });
  }
}

export interface EmbeddingCreateParams {
  /**
   * The model to use for creating embeddings.
   */
  model: string;

  /**
   * The input to create embeddings for.
   */
  input: string | Array<string>;

  /**
   * The number of dimensions to use for the embeddings.
   */
  dimensions?: number | null;

  /**
   * The prompt to use for the embedding creation.
   */
  prompt?: string | null;

  /**
   * Whether to normalize the embeddings.
   */
  normalized?: boolean;

  /**
   * The encoding format(s) of the embeddings. Can be a single format or a list of
   * formats.
   */
  encoding_format?:
    | 'float'
    | 'float16'
    | 'base64'
    | 'binary'
    | 'ubinary'
    | 'int8'
    | 'uint8'
    | Array<'float' | 'float16' | 'base64' | 'binary' | 'ubinary' | 'int8' | 'uint8'>;
}

export declare namespace Embeddings {
  export { type EmbeddingCreateParams as EmbeddingCreateParams };
}
