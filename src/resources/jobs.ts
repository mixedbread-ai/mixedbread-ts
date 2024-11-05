// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class Jobs extends APIResource {
  /**
   * Retrieve the status of a specific job by its ID.
   *
   * Args: job_id: The ID of the job to retrieve the status for.
   *
   * Returns: JobStatusResponse: The response containing the job status.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<JobRetrieveResponse> {
    return this._client.get(`/v1/jobs/${jobId}`, {
      ...options,
      headers: { Accept: 'application/json', ...options?.headers },
    });
  }

  /**
   * Delete a specific job by its ID.
   *
   * Args: job_id: The ID of the job to delete.
   *
   * Returns: JobDeleteResponse: The response containing the result of the job
   * deletion.
   */
  delete(jobId: string, options?: Core.RequestOptions): Core.APIPromise<JobDeleteResponse> {
    return this._client.delete(`/v1/jobs/${jobId}`, options);
  }
}

export type JobRetrieveResponse =
  | 'none'
  | 'running'
  | 'canceled'
  | 'successful'
  | 'failed'
  | 'resumable'
  | 'pending';

export type JobDeleteResponse = boolean;

export declare namespace Jobs {
  export { type JobRetrieveResponse as JobRetrieveResponse, type JobDeleteResponse as JobDeleteResponse };
}
