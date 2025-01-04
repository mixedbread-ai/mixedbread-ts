// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';
import * as ExtractAPI from './extract';
import * as SchemaAPI from './schema';
import {
  CreatedJsonSchema,
  EnhancedJsonSchema,
  Schema,
  SchemaCreateParams,
  SchemaEnhanceParams,
  SchemaValidateParams,
  ValidatedJsonSchema,
} from './schema';

export class Extract extends APIResource {
  schema: SchemaAPI.Schema = new SchemaAPI.Schema(this._client);

  /**
   * Extract content from a string using the provided schema.
   *
   * Args: params: ExtractContentCreateParams The parameters for extracting content
   * from a string.
   *
   * Returns: ExtractionResult: The extracted content.
   */
  content(body: ExtractContentParams, options?: Core.RequestOptions): Core.APIPromise<Result> {
    return this._client.post('/v1/document-ai/extract/content', { body, ...options });
  }

  /**
   * Start an extraction job for the provided file and schema.
   *
   * Args: params: ExtractJobCreateParams The parameters for creating an extraction
   * job.
   *
   * Returns: ExtractionJob: The created extraction job.
   */
  createJob(
    body: ExtractCreateJobParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ExtractCreateJobResponse> {
    return this._client.post('/v1/document-ai/extract', { body, ...options });
  }

  /**
   * Get detailed information about a specific extraction job.
   *
   * Args: job_id: The ID of the extraction job.
   *
   * Returns: ExtractionJob: Detailed information about the extraction job.
   */
  retrieveJob(jobId: string, options?: Core.RequestOptions): Core.APIPromise<ExtractRetrieveJobResponse> {
    return this._client.get(`/v1/document-ai/extract/${jobId}`, options);
  }
}

/**
 * Result of a schema extraction operation.
 *
 * Contains the extracted data from the extraction operation.
 */
export interface Result {
  /**
   * The extracted data from the extraction operation
   */
  data: unknown;
}

/**
 * Discriminated union of all possible extraction job states
 */
export type ExtractCreateJobResponse =
  | ExtractCreateJobResponse.RunningJob
  | ExtractCreateJobResponse.FailedJob
  | ExtractCreateJobResponse.SuccessfulExtractionJob;

export namespace ExtractCreateJobResponse {
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
   * Represents an extraction job that has completed successfully.
   *
   * Contains the extracted data from the extraction operation.
   */
  export interface SuccessfulExtractionJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The extracted data from the extraction operation
     */
    result: ExtractAPI.Result;

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
}

/**
 * Discriminated union of all possible extraction job states
 */
export type ExtractRetrieveJobResponse =
  | ExtractRetrieveJobResponse.RunningJob
  | ExtractRetrieveJobResponse.FailedJob
  | ExtractRetrieveJobResponse.SuccessfulExtractionJob;

export namespace ExtractRetrieveJobResponse {
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
   * Represents an extraction job that has completed successfully.
   *
   * Contains the extracted data from the extraction operation.
   */
  export interface SuccessfulExtractionJob {
    /**
     * The ID of the job
     */
    id: string;

    /**
     * The extracted data from the extraction operation
     */
    result: ExtractAPI.Result;

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
}

export interface ExtractContentParams {
  /**
   * The text content to extract structured data from
   */
  content: string;

  /**
   * The schema definition to use for extraction
   */
  json_schema: unknown;
}

export interface ExtractCreateJobParams {
  /**
   * The file ID to extract data from
   */
  file_id: string;

  /**
   * The schema definition to use for extraction
   */
  json_schema: unknown;
}

Extract.Schema = Schema;

export declare namespace Extract {
  export {
    type Result as Result,
    type ExtractCreateJobResponse as ExtractCreateJobResponse,
    type ExtractRetrieveJobResponse as ExtractRetrieveJobResponse,
    type ExtractContentParams as ExtractContentParams,
    type ExtractCreateJobParams as ExtractCreateJobParams,
  };

  export {
    Schema as Schema,
    type CreatedJsonSchema as CreatedJsonSchema,
    type EnhancedJsonSchema as EnhancedJsonSchema,
    type ValidatedJsonSchema as ValidatedJsonSchema,
    type SchemaCreateParams as SchemaCreateParams,
    type SchemaEnhanceParams as SchemaEnhanceParams,
    type SchemaValidateParams as SchemaValidateParams,
  };
}
