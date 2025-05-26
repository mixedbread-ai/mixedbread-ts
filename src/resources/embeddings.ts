// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as TopLevelAPI from './top-level';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Embeddings extends APIResource {
  /**
   * Create embeddings for text or images using the specified model, encoding format,
   * and normalization.
   *
   * Args: params: The parameters for creating embeddings.
   *
   * Returns: EmbeddingCreateResponse: The response containing the embeddings.
   *
   * @example
   * ```ts
   * const embeddingCreateResponse =
   *   await client.embeddings.create({
   *     model: 'mixedbread-ai/mxbai-embed-large-v1',
   *     input: 'x',
   *   });
   * ```
   */
  create(
    body: EmbeddingCreateParams,
    options?: RequestOptions,
  ): APIPromise<TopLevelAPI.EmbeddingCreateResponse> {
    return this._client.post('/v1/embeddings', { body, ...options });
  }
}

/**
 * Enumeration of encoding formats.
 */
export type EncodingFormat = 'float' | 'float16' | 'base64' | 'binary' | 'ubinary' | 'int8' | 'uint8';

export type ObjectType =
  | 'list'
  | 'parsing_job'
  | 'extraction_job'
  | 'embedding'
  | 'embedding_dict'
  | 'rank_result'
  | 'file'
  | 'vector_store'
  | 'vector_store.file'
  | 'api_key'
  | 'data_source'
  | 'data_source.connector';

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
  encoding_format?: EncodingFormat | Array<EncodingFormat>;
}

export declare namespace Embeddings {
  export {
    type EncodingFormat as EncodingFormat,
    type ObjectType as ObjectType,
    type EmbeddingCreateParams as EmbeddingCreateParams,
  };
}
