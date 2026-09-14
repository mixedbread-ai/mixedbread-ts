// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Content extends APIResource {
  /**
   * Extract content from a string using the provided schema.
   *
   * Args: params: The parameters for extracting content from a string.
   *
   * Returns: The extracted content.
   */
  create(body: ContentCreateParams, options?: RequestOptions): APIPromise<ExtractionResult> {
    return this._client.post('/v1/extractions/content', { body, ...options });
  }
}

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
  image_url: ImageURLInput.ImageURL;
}

export namespace ImageURLInput {
  /**
   * The image input specification.
   */
  export interface ImageURL {
    /**
     * The image URL. Can be either a URL or a Data URI.
     */
    url: string;

    /**
     * The image format/mimetype
     */
    format?: string;
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

/**
 * The result of an extraction job.
 */
export interface ExtractionResult {
  data: { [key: string]: unknown };

  warnings: Array<string>;
}

export interface ContentCreateParams {
  /**
   * The content to extract from
   */
  content: string | Array<string> | Array<ContentCreateParams.ContentUnionMember2>;

  /**
   * The JSON schema to use for extraction
   */
  json_schema: { [key: string]: unknown };

  /**
   * Additional instructions for the extraction
   */
  instructions?: string | null;
}

export namespace ContentCreateParams {
  export type ContentUnionMember2 = TextInput | ImageURLInput;
}

export declare namespace Content {
  export {
    type ImageURLInput as ImageURLInput,
    type TextInput as TextInput,
    type ExtractionResult as ExtractionResult,
    type ContentCreateParams as ContentCreateParams,
  };
}
