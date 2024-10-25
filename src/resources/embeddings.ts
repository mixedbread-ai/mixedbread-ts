// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import * as EmbeddingsAPI from './embeddings';

export class Embeddings extends APIResource {
  /**
   * Create embeddings for text or images using the specified model, encoding format,
   * and normalization.
   */
  create(
    body: EmbeddingCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<EmbeddingCreateResponse> {
    return this._client.post('/v1/embeddings', { body, ...options });
  }
}

export interface EmbeddingCreateResponse {
  /**
   * The created embeddings.
   */
  data: Array<EmbeddingCreateResponse.UnionMember0> | Array<EmbeddingCreateResponse.UnionMember1>;

  /**
   * The number of dimensions used for the embeddings.
   */
  dimensions: number | null;

  /**
   * The encoding format of the embeddings.
   */
  encoding_format:
    | 'float'
    | 'float16'
    | 'base64'
    | 'binary'
    | 'ubinary'
    | 'int8'
    | 'uint8'
    | Array<'float' | 'float16' | 'base64' | 'binary' | 'ubinary' | 'int8' | 'uint8'>;

  /**
   * The model used
   */
  model: string;

  /**
   * Whether the embeddings are normalized.
   */
  normalized: boolean;

  /**
   * The usage of the model
   */
  usage: EmbeddingCreateResponse.Usage;

  /**
   * The object type of the response
   */
  object?: 'list' | 'embedding' | 'embedding_dict' | 'text_document' | 'file';
}

export namespace EmbeddingCreateResponse {
  export interface UnionMember0 {
    /**
     * The encoded embedding.
     */
    embedding: Array<number> | Array<number> | string;

    /**
     * The index of the embedding.
     */
    index: number;

    /**
     * The object type of the embedding.
     */
    object: 'embedding';
  }

  export interface UnionMember1 {
    /**
     * The encoded embedding data by encoding format. Returned, if more than one
     * encoding format is used.
     */
    embedding: UnionMember1.Embedding;

    /**
     * The index of the embedding.
     */
    index: number;

    /**
     * The object type of the embedding.
     */
    object: 'embedding_dict';
  }

  export namespace UnionMember1 {
    /**
     * The encoded embedding data by encoding format. Returned, if more than one
     * encoding format is used.
     */
    export interface Embedding {
      base64?: Array<string>;

      binary?: Array<number>;

      float?: Array<number>;

      int8?: Array<number>;

      ubinary?: Array<number>;

      uint8?: Array<number>;
    }
  }

  /**
   * The usage of the model
   */
  export interface Usage {
    /**
     * The number of tokens used for the prompt
     */
    prompt_tokens: number;

    /**
     * The total number of tokens used
     */
    total_tokens: number;

    /**
     * The number of tokens used for the completion
     */
    completion_tokens?: number | null;
  }
}

export interface EmbeddingCreateParams {
  /**
   * The input to create embeddings for.
   */
  input: string | EmbeddingCreateParams.TextInput | unknown;

  /**
   * The model to use for creating embeddings.
   */
  model: string;

  /**
   * The number of dimensions to use for the embeddings.
   */
  dimensions?: number | null;

  /**
   * The encoding format of the embeddings.
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

  /**
   * Whether to normalize the embeddings.
   */
  normalized?: boolean;

  /**
   * The prompt to use for the embedding creation.
   */
  prompt?: string | null;

  /**
   * The truncation strategy to use for the input.
   */
  truncation_strategy?: 'none' | 'start' | 'end';
}

export namespace EmbeddingCreateParams {
  /**
   * The text input document to create embeddings for.
   */
  export interface TextInput {
    /**
     * The text to be processed
     */
    text: string;
  }
}

export namespace Embeddings {
  export import EmbeddingCreateResponse = EmbeddingsAPI.EmbeddingCreateResponse;
  export import EmbeddingCreateParams = EmbeddingsAPI.EmbeddingCreateParams;
}
