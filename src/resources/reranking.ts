// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class Reranking extends APIResource {
  /**
   * Rerank different kind of documents for a given query.
   *
   * Args: params: RerankingCreateParams: The parameters for reranking.
   *
   * Returns: RerankingCreateResponse: The reranked documents for the input query.
   */
  create(
    body: RerankingCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<RerankingCreateResponse> {
    return this._client.post('/v1/reranking', { body, ...options });
  }
}

export interface RerankingCreateResponse {
  /**
   * The ranked documents.
   */
  data: Array<RerankingCreateResponse.Data>;

  /**
   * The model used
   */
  model: string;

  /**
   * Whether to return the documents.
   */
  return_input: boolean;

  /**
   * The number of documents to return.
   */
  top_k: number;

  /**
   * The usage of the model
   */
  usage: RerankingCreateResponse.Usage;

  /**
   * The object type of the response
   */
  object?:
    | 'list'
    | 'job'
    | 'embedding'
    | 'embedding_dict'
    | 'text_document'
    | 'file'
    | 'vector_store'
    | 'vector_store.file'
    | 'api_key';
}

export namespace RerankingCreateResponse {
  export interface Data {
    index: number;

    /**
     * The input document.
     */
    input: unknown;

    /**
     * The score of the document.
     */
    score: number;

    /**
     * The object type.
     */
    object?:
      | 'list'
      | 'job'
      | 'embedding'
      | 'embedding_dict'
      | 'text_document'
      | 'file'
      | 'vector_store'
      | 'vector_store.file'
      | 'api_key';
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

export interface RerankingCreateParams {
  /**
   * The input documents to rerank.
   */
  input: Array<string | unknown>;

  /**
   * The query to rerank the documents.
   */
  query: string;

  /**
   * The model to use for reranking documents.
   */
  model?: string;

  /**
   * The fields of the documents to rank.
   */
  rank_fields?: Array<string> | null;

  /**
   * Whether to return the documents.
   */
  return_input?: boolean;

  /**
   * The number of documents to return.
   */
  top_k?: number;
}

export declare namespace Reranking {
  export {
    type RerankingCreateResponse as RerankingCreateResponse,
    type RerankingCreateParams as RerankingCreateParams,
  };
}
