// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface Em {
  /**
   * The usage of the model
   */
  usage: Em.Usage;

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
  object?:
    | 'list'
    | 'parsing_job'
    | 'job'
    | 'embedding'
    | 'embedding_dict'
    | 'rank_result'
    | 'file'
    | 'vector_store'
    | 'vector_store.file'
    | 'api_key';

  /**
   * Whether the embeddings are normalized.
   */
  normalized: boolean;

  /**
   * The encoding formats of the embeddings.
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
   * The number of dimensions used for the embeddings.
   */
  dimensions: number | null;
}

export namespace Em {
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
  usage: RerankResponse.Usage;

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
  object?:
    | 'list'
    | 'parsing_job'
    | 'job'
    | 'embedding'
    | 'embedding_dict'
    | 'rank_result'
    | 'file'
    | 'vector_store'
    | 'vector_store.file'
    | 'api_key';

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
  input: Array<string>;

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
}

export declare namespace TopLevel {
  export {
    type Em as Em,
    type Embedding as Embedding,
    type MultiEncodingEmbedding as MultiEncodingEmbedding,
    type InfoResponse as InfoResponse,
    type RerankResponse as RerankResponse,
    type EmbedParams as EmbedParams,
    type RerankParams as RerankParams,
  };
}
