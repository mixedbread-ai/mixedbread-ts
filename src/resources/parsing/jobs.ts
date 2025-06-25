// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../core/api-promise';
import { Cursor, type CursorParams, PagePromise } from '../../core/pagination';
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
  ): PagePromise<JobListResponsesCursor, JobListResponse> {
    return this._client.getAPIList('/v1/parsing/jobs', Cursor<JobListResponse>, { query, ...options });
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

export type JobListResponsesCursor = Cursor<JobListResponse>;

/**
 * Strategy used for chunking document content.
 */
export type ChunkingStrategy = 'page';

/**
 * Types of elements that can be extracted from a document.
 */
export type ElementType =
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

export type ParsingJobStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

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
  status: ParsingJobStatus;

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
    chunking_strategy: JobsAPI.ChunkingStrategy;

    /**
     * The format of the returned content
     */
    return_format: JobsAPI.ReturnFormat;

    /**
     * The types of elements extracted
     */
    element_types: Array<JobsAPI.ElementType>;

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
       * The content of the chunk to embed
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
        type: JobsAPI.ElementType;

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
 * Format options for the returned document content.
 */
export type ReturnFormat = 'html' | 'markdown' | 'plain';

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
  status: ParsingJobStatus;

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
  element_types?: Array<ElementType> | null;

  /**
   * The strategy to use for chunking the content
   */
  chunking_strategy?: ChunkingStrategy;

  /**
   * The format of the returned content
   */
  return_format?: ReturnFormat;

  /**
   * The strategy to use for OCR
   */
  mode?: 'fast' | 'high_quality';
}

export interface JobListParams extends CursorParams {}

export declare namespace Jobs {
  export {
    type ChunkingStrategy as ChunkingStrategy,
    type ElementType as ElementType,
    type ParsingJobStatus as ParsingJobStatus,
    type ParsingJob as ParsingJob,
    type ReturnFormat as ReturnFormat,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobListResponsesCursor as JobListResponsesCursor,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
