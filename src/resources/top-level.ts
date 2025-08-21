// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as EmbeddingsAPI from './embeddings';
import * as Shared from './shared';

export interface Embedding {
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
  object?: 'embedding';
}

export interface EmbeddingCreateResponse {
  /**
   * The usage of the model
   */
  usage: Shared.Usage;

  /**
   * The model used
   */
  model: string;

  /**
   * The created embeddings.
   */
  data: Array<Embedding> | Array<MultiEncodingEmbedding>;

  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * Whether the embeddings are normalized.
   */
  normalized: boolean;

  /**
   * The encoding formats of the embeddings.
   */
  encoding_format: EmbeddingsAPI.EncodingFormat | Array<EmbeddingsAPI.EncodingFormat>;

  /**
   * The number of dimensions used for the embeddings.
   */
  dimensions: number | null;
}

export interface MultiEncodingEmbedding {
  /**
   * The encoded embedding data by encoding format.Returned, if more than one
   * encoding format is used.
   */
  embedding: MultiEncodingEmbedding.Embedding;

  /**
   * The index of the embedding.
   */
  index: number;

  /**
   * The object type of the embedding.
   */
  object?: 'embedding_dict';
}

export namespace MultiEncodingEmbedding {
  /**
   * The encoded embedding data by encoding format.Returned, if more than one
   * encoding format is used.
   */
  export interface Embedding {
    float?: Array<number>;

    int8?: Array<number>;

    uint8?: Array<number>;

    binary?: Array<number>;

    ubinary?: Array<number>;

    base64?: string;
  }
}

/**
 * Info Pydantic Response Service Message
 */
export interface InfoResponse {
  name: string;

  version: string;
}

export interface RerankResponse {
  /**
   * The usage of the model
   */
  usage: Shared.Usage;

  /**
   * The model used
   */
  model: string;

  /**
   * The ranked documents.
   */
  data: Array<RerankResponse.Data>;

  /**
   * The object type of the response
   */
  object?: 'list';

  /**
   * The number of documents to return.
   */
  top_k: number;

  /**
   * Whether to return the documents.
   */
  return_input: boolean;
}

export namespace RerankResponse {
  export interface Data {
    /**
     * The index of the document.
     */
    index: number;

    /**
     * The score of the document.
     */
    score: number;

    /**
     * The input document.
     */
    input?: unknown;

    /**
     * The object type.
     */
    object?: 'rank_result';
  }
}

export interface EmbedParams {
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
  encoding_format?: EmbeddingsAPI.EncodingFormat | Array<EmbeddingsAPI.EncodingFormat>;
}

export interface RerankParams {
  /**
   * The model to use for reranking documents.
   */
  model?: string;

  /**
   * The query to rerank the documents.
   */
  query: string;

  /**
   * The input documents to rerank.
   */
  input: Array<string | unknown | Array<unknown>>;

  /**
   * The fields of the documents to rank.
   */
  rank_fields?: Array<string> | null;

  /**
   * The number of documents to return.
   */
  top_k?: number;

  /**
   * Whether to return the documents.
   */
  return_input?: boolean;

  /**
   * Wether or not to rewrite the query before passing it to the reranking model
   */
  rewrite_query?: boolean;
}

export declare namespace TopLevel {
  export {
    type Embedding as Embedding,
    type EmbeddingCreateResponse as EmbeddingCreateResponse,
    type MultiEncodingEmbedding as MultiEncodingEmbedding,
    type InfoResponse as InfoResponse,
    type RerankResponse as RerankResponse,
    type EmbedParams as EmbedParams,
    type RerankParams as RerankParams,
  };
}
