// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

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
    | 'text_document'
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
    index: number;

    /**
     * The score of the document.
     */
    score: number;

    /**
     * The input document.
     */
    input: unknown;

    /**
     * The object type.
     */
    object?:
      | 'list'
      | 'parsing_job'
      | 'job'
      | 'embedding'
      | 'embedding_dict'
      | 'text_document'
      | 'file'
      | 'vector_store'
      | 'vector_store.file'
      | 'api_key';
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
  input: string | EmbedParams.ImageURLInput | EmbedParams.TextInput;

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
}

export namespace EmbedParams {
  /**
   * Model for image input validation.
   */
  export interface ImageURLInput {
    /**
     * Input type identifier
     */
    type?: 'image_url';

    /**
     * The image input specification.
     */
    image: ImageURLInput.Image;
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
     * Input type identifier
     */
    type?: 'text';

    /**
     * Text content to process
     */
    text: string;
  }
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
  input: Array<string | unknown>;

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
    type InfoResponse as InfoResponse,
    type RerankResponse as RerankResponse,
    type EmbedParams as EmbedParams,
    type RerankParams as RerankParams,
  };
}
