// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
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
 * A chunk of text extracted from a document page.
 */
export interface Chunk {
  /**
   * The full content of the chunk
   */
  content?: string | null;

  /**
   * The content of the chunk to embed
   */
  content_to_embed: string;

  /**
   * List of elements contained in this chunk
   */
  elements: Array<ChunkElement>;
}

/**
 * Represents an extracted element from a document with its content and metadata.
 */
export interface ChunkElement {
  /**
   * The type of the extracted element
   */
  type: ElementType;

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
   * The extracted text content of the element
   */
  content: string;

  /**
   * A brief summary of the element's content
   */
  summary?: string | null;

  /**
   * The base64-encoded image data for figure elements
   */
  image?: string | null;
}

/**
 * Strategy used for chunking document content.
 */
export type ChunkingStrategy = 'page';

/**
 * Result of document parsing operation.
 */
export interface DocumentParserResult {
  /**
   * The strategy used for chunking the document
   */
  chunking_strategy: ChunkingStrategy;

  /**
   * The format of the returned content
   */
  return_format: ReturnFormat;

  /**
   * The types of elements extracted
   */
  element_types: Array<ElementType>;

  /**
   * List of extracted chunks from the document
   */
  chunks: Array<Chunk>;

  /**
   * List of (width, height) tuples for each page
   */
  page_sizes?: Array<Array<unknown>>;
}

/**
 * Types of elements that can be extracted from a document.
 */
export type ElementType =
  | 'header'
  | 'footer'
  | 'title'
  | 'section-header'
  | 'page-number'
  | 'list-item'
  | 'figure'
  | 'table'
  | 'form'
  | 'text'
  | 'footnote';

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
   * The name of the file
   */
  filename?: string | null;

  /**
   * The status of the job
   */
  status: ParsingJobStatus;

  /**
   * The error of the job
   */
  error?: { [key: string]: unknown } | null;

  /**
   * Result of document parsing operation.
   */
  result?: DocumentParserResult | null;

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

export type ParsingJobStatus = 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

/**
 * Format options for the returned document content.
 */
export type ReturnFormat = 'html' | 'markdown' | 'plain';

/**
 * A parsing job item for list responses.
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
   * The name of the file
   */
  filename?: string | null;

  /**
   * The status of the job
   */
  status: ParsingJobStatus;

  /**
   * The error of the job
   */
  error?: { [key: string]: unknown } | null;

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

export interface JobListParams extends CursorParams {
  /**
   * Status to filter by
   */
  statuses?: Array<ParsingJobStatus> | null;

  /**
   * Search query to filter by
   */
  q?: string | null;
}

export declare namespace Jobs {
  export {
    type Chunk as Chunk,
    type ChunkElement as ChunkElement,
    type ChunkingStrategy as ChunkingStrategy,
    type DocumentParserResult as DocumentParserResult,
    type ElementType as ElementType,
    type ParsingJob as ParsingJob,
    type ParsingJobStatus as ParsingJobStatus,
    type ReturnFormat as ReturnFormat,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobListResponsesCursor as JobListResponsesCursor,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
