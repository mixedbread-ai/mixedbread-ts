// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import * as ServiceStatusAPI from './service-status';

export class ServiceStatus extends APIResource {
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

  /**
   * Rerank different kind of documents for a given query
   */
  rerank(
    body: ServiceStatusRerankParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ServiceStatusRerankResponse> {
    return this._client.post('/v1/v1/reranking', { body, ...options });
  }
}

/**
 * Info Pydantic Response Service Message
 */
export interface InfoResponse {
  name: string;

  version: string;
}

export interface ServiceStatusRerankResponse {
  /**
   * The ranked documents.
   */
  data: Array<ServiceStatusRerankResponse.Data>;

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
  usage: ServiceStatusRerankResponse.Usage;

  /**
   * The object type of the response
   */
  object?: 'list' | 'embedding' | 'embedding_dict' | 'text_document' | 'file';
}

export namespace ServiceStatusRerankResponse {
  export interface Data {
    /**
     * The index of the document.
     */
    index: number;

    /**
     * The input document.
     */
    input: unknown | null;

    /**
     * The score of the document.
     */
    score: number;

    /**
     * The object type.
     */
    object?: 'list' | 'embedding' | 'embedding_dict' | 'text_document' | 'file';
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

export interface ServiceStatusRerankParams {
  /**
   * The text input documents to rerank.
   */
  input: Array<string> | Array<unknown>;

  /**
   * The query to rerank the documents.
   */
  query: ServiceStatusRerankParams.TextInput | string;

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

export namespace ServiceStatusRerankParams {
  export interface TextInput {
    /**
     * The text to be processed
     */
    text: string;
  }
}

export namespace ServiceStatus {
  export import InfoResponse = ServiceStatusAPI.InfoResponse;
  export import ServiceStatusRerankResponse = ServiceStatusAPI.ServiceStatusRerankResponse;
  export import ServiceStatusRerankParams = ServiceStatusAPI.ServiceStatusRerankParams;
}
