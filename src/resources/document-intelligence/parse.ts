// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as ParseAPI from './parse';

export class Parse extends APIResource {
  /**
   * Start a parse job for the provided file.
   *
   * Args: file: The file to parse information from. state: The application state.
   *
   * Returns: ParseResponse: The response containing the created job information.
   */
  create(body: ParseCreateParams, options?: Core.RequestOptions): Core.APIPromise<ParseResponse> {
    return this._client.post(
      '/v1/document-intelligence/parse',
      Core.multipartFormRequestOptions({ body, ...options }),
    );
  }

  /**
   * Get detailed information about a specific parse job.
   *
   * Args: job_id: The ID of the parse job. state: The application state.
   *
   * Returns: ParseResponse: Detailed information about the parse job.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<ParseResponse> {
    return this._client.get(`/v1/document-intelligence/parse/${jobId}`, options);
  }
}

export interface ParseResponse {
  /**
   * Discriminated union of all possible parsing job states
   */
  data: ParseResponse.RunningJob | ParseResponse.FailedJob | ParseResponse.SuccessfulParsingJob;
}

export namespace ParseResponse {
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
    finished_at?: string;

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
    finished_at?: string;

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
    }

    export namespace Result {
      /**
       * A chunk of text extracted from a page.
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
         * A single element extracted from a page.
         */
        export interface Element {
          /**
           * The bounding box coordinates [x1, y1, x2, y2]
           */
          bbox: Array<number>;

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

export interface ParseCreateParams {
  /**
   * The file to parse information from
   */
  file: Core.Uploadable;
}

export namespace Parse {
  export import ParseResponse = ParseAPI.ParseResponse;
  export import ParseCreateParams = ParseAPI.ParseCreateParams;
}
