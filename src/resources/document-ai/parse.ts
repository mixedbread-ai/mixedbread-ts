// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';

export class Parse extends APIResource {
  /**
   * Start a parse job for the provided file.
   *
   * Args: params: ParseJobCreateParams The parameters for creating a parse job.
   *
   * Returns: ParsingJob: The created parse job.
   */
  createJob(
    body: ParseCreateJobParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ParseCreateJobResponse> {
    return this._client.post('/v1/document-ai/parse', { body, ...options });
  }

  /**
   * Get detailed information about a specific parse job.
   *
   * Args: job_id: The ID of the parse job.
   *
   * Returns: ParsingJob: Detailed information about the parse job.
   */
  retrieveJob(jobId: string, options?: Core.RequestOptions): Core.APIPromise<ParseRetrieveJobResponse> {
    return this._client.get(`/v1/document-ai/parse/${jobId}`, options);
  }
}

/**
 * Discriminated union of all possible parsing job states
 */
export type ParseCreateJobResponse =
  | ParseCreateJobResponse.RunningJob
  | ParseCreateJobResponse.FailedJob
  | ParseCreateJobResponse.SuccessfulParsingJob;

export namespace ParseCreateJobResponse {
  export interface RunningJob {
    /**
     * The ID of the job
     */
    id: string;

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
     * The result of the job
     */
    result?: unknown | null;

    /**
     * The status of the job
     */
    status?: 'pending' | 'running';
  }

  export interface FailedJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The errors of the job
     */
    errors: Array<string>;

    /**
     * The creation time of the job
     */
    created_at?: string;

    /**
     * The finished time of the job
     */
    finished_at?: string | null;

    /**
     * The type of the object
     */
    object?: 'job';

    /**
     * The result of the job
     */
    result?: unknown | null;

    /**
     * The status of the job
     */
    status?: 'failed';
  }

  /**
   * Represents a parsing job that has completed successfully.
   *
   * Contains the extracted document content and metadata from the parsing operation.
   */
  export interface SuccessfulParsingJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The extracted content and metadata from the document
     */
    result: SuccessfulParsingJob.Result;

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
     * The status of the job
     */
    status?: 'successful';
  }

  export namespace SuccessfulParsingJob {
    /**
     * The extracted content and metadata from the document
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
}

/**
 * Discriminated union of all possible parsing job states
 */
export type ParseRetrieveJobResponse =
  | ParseRetrieveJobResponse.RunningJob
  | ParseRetrieveJobResponse.FailedJob
  | ParseRetrieveJobResponse.SuccessfulParsingJob;

export namespace ParseRetrieveJobResponse {
  export interface RunningJob {
    /**
     * The ID of the job
     */
    id: string;

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
     * The result of the job
     */
    result?: unknown | null;

    /**
     * The status of the job
     */
    status?: 'pending' | 'running';
  }

  export interface FailedJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The errors of the job
     */
    errors: Array<string>;

    /**
     * The creation time of the job
     */
    created_at?: string;

    /**
     * The finished time of the job
     */
    finished_at?: string | null;

    /**
     * The type of the object
     */
    object?: 'job';

    /**
     * The result of the job
     */
    result?: unknown | null;

    /**
     * The status of the job
     */
    status?: 'failed';
  }

  /**
   * Represents a parsing job that has completed successfully.
   *
   * Contains the extracted document content and metadata from the parsing operation.
   */
  export interface SuccessfulParsingJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The extracted content and metadata from the document
     */
    result: SuccessfulParsingJob.Result;

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
     * The status of the job
     */
    status?: 'successful';
  }

  export namespace SuccessfulParsingJob {
    /**
     * The extracted content and metadata from the document
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
}

export interface ParseCreateJobParams {
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

export declare namespace Parse {
  export {
    type ParseCreateJobResponse as ParseCreateJobResponse,
    type ParseRetrieveJobResponse as ParseRetrieveJobResponse,
    type ParseCreateJobParams as ParseCreateJobParams,
  };
}
