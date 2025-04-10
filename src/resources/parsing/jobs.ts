// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Jobs extends APIResource {
  /**
   * Start a parse job for the provided file.
   *
   * Args: params: The parameters for creating a parse job.
   *
   * Returns: The created parsing job.
   */
  create(body: JobCreateParams, options?: RequestOptions): APIPromise<ParsingJob> {
    return this._client.post('/v1/parsing/jobs', { body, ...options });
  }

  /**
   * Get detailed information about a specific parse job.
   *
   * Args: job_id: The ID of the parse job.
   *
   * Returns: Detailed information about the parse job.
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<ParsingJob> {
    return this._client.get(path`/v1/parsing/jobs/${jobID}`, options);
  }

  /**
   * List parsing jobs with pagination.
   *
   * Args: limit: The number of items to return. offset: The number of items to skip.
   *
   * Returns: List of parsing jobs with pagination.
   */
  list(
    query: JobListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<JobListResponsesLimitOffset, JobListResponse> {
    return this._client.getAPIList('/v1/parsing/jobs', LimitOffset<JobListResponse>, { query, ...options });
  }

  /**
   * Delete a specific parse job.
   *
   * Args: job_id: The ID of the parse job to delete.
   *
   * Returns: The deleted parsing job.
   */
  delete(jobID: string, options?: RequestOptions): APIPromise<JobDeleteResponse> {
    return this._client.delete(path`/v1/parsing/jobs/${jobID}`, options);
  }

  /**
   * Cancel a specific parse job.
   *
   * Args: job_id: The ID of the parse job to cancel.
   *
   * Returns: The cancelled parsing job.
   */
  cancel(jobID: string, options?: RequestOptions): APIPromise<ParsingJob> {
    return this._client.patch(path`/v1/parsing/jobs/${jobID}`, options);
  }
}

export type JobListResponsesLimitOffset = LimitOffset<JobListResponse>;

/**
 * A job for parsing documents with its current state and result.
 */
export interface ParsingJob {
  /**
   * The ID of the job
   */
  id: string;

  /**
   * The ID of the file to parse
   */
  file_id: string;

  /**
   * The status of the job
   */
  status: 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The error of the job
   */
  error?: unknown;

  /**
   * Result of document parsing operation.
   */
  result?: ParsingJob.Result | null;

  /**
   * The started time of the job
   */
  started_at?: string | null;

  /**
   * The finished time of the job
   */
  finished_at?: string | null;

  /**
   * The creation time of the job
   */
  created_at?: string;

  /**
   * The updated time of the job
   */
  updated_at?: string | null;

  /**
   * The type of the object
   */
  object?: 'parsing_job';
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
     * The format of the returned content
     */
    return_format: 'html' | 'markdown' | 'plain';

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
     * List of extracted chunks from the document
     */
    chunks: Array<Result.Chunk>;

    /**
     * List of (width, height) tuples for each page
     */
    page_sizes?: Array<Array<unknown>>;
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
         * The confidence score of the extraction
         */
        confidence: number;

        /**
         * The bounding box coordinates [x1, y1, x2, y2]
         */
        bbox: Array<unknown>;

        /**
         * The page number where the element was found
         */
        page: number;

        /**
         * The full content of the extracted element
         */
        content: string;

        /**
         * A brief summary of the element's content
         */
        summary?: string | null;
      }
    }
  }
}

/**
 * A parsing job item for list responses, omitting result and error fields.
 */
export interface JobListResponse {
  /**
   * The ID of the job
   */
  id: string;

  /**
   * The ID of the file to parse
   */
  file_id: string;

  /**
   * The status of the job
   */
  status: 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The started time of the job
   */
  started_at?: string | null;

  /**
   * The finished time of the job
   */
  finished_at?: string | null;

  /**
   * The creation time of the job
   */
  created_at?: string;

  /**
   * The updated time of the job
   */
  updated_at?: string | null;

  /**
   * The type of the object
   */
  object?: 'parsing_job';
}

/**
 * A deleted parsing job.
 */
export interface JobDeleteResponse {
  /**
   * The ID of the deleted job
   */
  id: string;

  /**
   * Whether the job was deleted
   */
  deleted?: boolean;

  /**
   * The type of the object
   */
  object?: 'parsing_job';
}

export interface JobCreateParams {
  /**
   * The ID of the file to parse
   */
  file_id: string;

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
   * The strategy to use for chunking the content
   */
  chunking_strategy?: 'page';

  /**
   * The format of the returned content
   */
  return_format?: 'html' | 'markdown' | 'plain';
}

export interface JobListParams extends LimitOffsetParams {}

export declare namespace Jobs {
  export {
    type ParsingJob as ParsingJob,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobListResponsesLimitOffset as JobListResponsesLimitOffset,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
