// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface EmbedResponse {
  /**
   * The created embeddings.
   */
  data: Array<EmbedResponse.UnionMember0> | Array<EmbedResponse.UnionMember1>;

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
  usage: EmbedResponse.Usage;

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

export namespace EmbedResponse {
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
     * The encoded embedding data by encoding format.Returned, if more than one
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
     * The encoded embedding data by encoding format.Returned, if more than one
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

/**
 * Info Pydantic Response Service Message
 */
export interface InfoResponse {
  name: string;

  version: string;
}

export interface RerankResponse {
  /**
   * The ranked documents.
   */
  data: Array<RerankResponse.Data>;

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
  usage: RerankResponse.Usage;

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

export namespace RerankResponse {
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

export interface EmbedParams {
  /**
   * The input to create embeddings for.
   */
  input: string | EmbedParams.ImageURLInput | EmbedParams.TextInput;

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
}

export namespace EmbedParams {
  /**
   * Model for image input validation.
   */
  export interface ImageURLInput {
    /**
     * The image input specification.
     */
    image: ImageURLInput.Image;

    /**
     * Input type identifier
     */
    type?: 'image_url';
  }

  export namespace ImageURLInput {
    /**
     * The image input specification.
     */
    export interface Image {
      /**
       * The image URL. Can be either a URL or a Data URI.
       */
      url: string;
    }
  }

  /**
   * Model for text input validation.
   *
   * Attributes: type: Input type identifier, always "text" text: The actual text
   * content, with length and whitespace constraints
   */
  export interface TextInput {
    /**
     * Text content to process
     */
    text: string;

    /**
     * Input type identifier
     */
    type?: 'text';
  }
}

export interface RerankParams {
  input: unknown;

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

export declare namespace TopLevel {
  export {
    type EmbedResponse as EmbedResponse,
    type InfoResponse as InfoResponse,
    type RerankResponse as RerankResponse,
    type EmbedParams as EmbedParams,
    type RerankParams as RerankParams,
  };
}
