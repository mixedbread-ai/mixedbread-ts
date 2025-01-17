// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as ContentAPI from './content';

export class Jobs extends APIResource {
  /**
   * Start an extraction job for the provided file and schema.
   *
   * Args: params: The parameters for creating an extraction job.
   *
   * Returns: The created extraction job.
   */
  create(body: JobCreateParams, options?: Core.RequestOptions): Core.APIPromise<ExtractionJob> {
    return this._client.post('/v1/extractions/jobs', { body, ...options });
  }

  /**
   * Get detailed information about a specific extraction job.
   *
   * Args: job_id: The ID of the extraction job.
   *
   * Returns: Detailed information about the extraction job.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<ExtractionJob> {
    return this._client.get(`/v1/extractions/jobs/${jobId}`, options);
  }
}

/**
 * A job for extracting structured data from documents.
 */
export interface ExtractionJob {
  /**
   * Result of an extraction operation.
   */
  result: ContentAPI.ExtractionResult | null;
}

export interface JobCreateParams {
  /**
   * The ID of the file to extract from
   */
  file_id: string;

  /**
   * The JSON schema to use for extraction
   */
  json_schema: unknown;
}

export declare namespace Jobs {
  export { type ExtractionJob as ExtractionJob, type JobCreateParams as JobCreateParams };
}
