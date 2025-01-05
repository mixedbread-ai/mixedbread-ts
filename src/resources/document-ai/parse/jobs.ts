// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Jobs extends APIResource {
  /**
   * Start a parse job for the provided file.
   *
   * Args: params: ParseJobCreateParams The parameters for creating a parse job.
   *
   * Returns: ParsingJob: The created parse job.
   */
  create(body: JobCreateParams, options?: Core.RequestOptions): Core.APIPromise<ParsingJob> {
    return this._client.post('/v1/document-ai/parse', { body, ...options });
  }

  /**
   * Get detailed information about a specific parse job.
   *
   * Args: job_id: The ID of the parse job.
   *
   * Returns: ParsingJob: Detailed information about the parse job.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<ParsingJob> {
    return this._client.get(`/v1/document-ai/parse/${jobId}`, options);
  }
}

/**
 * A job for parsing documents with its current state and result.
 */
export interface ParsingJob {
  /**
   * The ID of the job
   */
  id: string;

  /**
   * The status of the job
   */
  status: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

  /**
   * The creation time of the job
   */
  created_at?: string;

  /**
   * The errors of the job
   */
  errors?: Array<string> | null;

  /**
   * The finished time of the job
   */
  finished_at?: string | null;

  /**
   * The type of the object
   */
  object?: 'job';

  /**
   * Result of document parsing operation.
   */
  result?: ParsingJob.Result | null;
}

export namespace ParsingJob {
  /**
   * Result of document parsing operation.
   */
  export interface Result {
    /**
     * The strategy used for chunking the document
     */
    chunking_strategy: 'page';

    /**
     * List of extracted chunks from the document
     */
    chunks: Array<Result.Chunk>;

    /**
     * The types of elements extracted
     */
    element_types: Array<
      | 'caption'
      | 'footnote'
      | 'formula'
      | 'list-item'
      | 'page-footer'
      | 'page-header'
      | 'picture'
      | 'section-header'
      | 'table'
      | 'text'
      | 'title'
    >;

    /**
     * The format of the returned content
     */
    return_format: 'html' | 'markdown' | 'plain';
  }

  export namespace Result {
    /**
     * A chunk of text extracted from a document page.
     */
    export interface Chunk {
      /**
       * The full content of the chunk
       */
      content: string;

      /**
       * The content to be used for embedding
       */
      content_to_embed: string;

      /**
       * List of elements contained in this chunk
       */
      elements: Array<Chunk.Element>;
    }

    export namespace Chunk {
      /**
       * Represents an extracted element from a document with its content and metadata.
       */
      export interface Element {
        /**
         * The bounding box coordinates [x1, y1, x2, y2]
         */
        bbox: Array<unknown>;

        /**
         * The confidence score of the extraction
         */
        confidence: number;

        /**
         * The full content of the extracted element
         */
        content: string;

        /**
         * The page number where the element was found
         */
        page: number;

        /**
         * The type of the extracted element
         */
        type:
          | 'caption'
          | 'footnote'
          | 'formula'
          | 'list-item'
          | 'page-footer'
          | 'page-header'
          | 'picture'
          | 'section-header'
          | 'table'
          | 'text'
          | 'title';

        /**
         * A brief summary of the element's content
         */
        summary?: string | null;
      }
    }
  }
}

export interface JobCreateParams {
  /**
   * The ID of the file to parse
   */
  file_id: string;

  /**
   * The strategy to use for chunking the content
   */
  chunking_strategy?: 'page';

  /**
   * The elements to extract from the document
   */
  element_types?: Array<
    | 'caption'
    | 'footnote'
    | 'formula'
    | 'list-item'
    | 'page-footer'
    | 'page-header'
    | 'picture'
    | 'section-header'
    | 'table'
    | 'text'
    | 'title'
  > | null;

  /**
   * The format of the returned content
   */
  return_format?: 'html' | 'markdown' | 'plain';
}

export declare namespace Jobs {
  export { type ParsingJob as ParsingJob, type JobCreateParams as JobCreateParams };
}
