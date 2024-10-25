// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import * as JobsAPI from './jobs';

export class Jobs extends APIResource {
  /**
   * Retrieve the status of a specific job by its ID.
   *
   * Args: job_id: The ID of the job to retrieve the status for. state: The
   * application state.
   *
   * Returns: JobStatusResponse: The response containing the job status.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<JobStatusResponse> {
    return this._client.get(`/v1/jobs/${jobId}`, options);
  }

  /**
   * Delete a specific job by its ID.
   *
   * Args: job_id: The ID of the job to delete. state: The application state.
   *
   * Returns: JobDeleteResponse: The response containing the result of the job
   * deletion.
   */
  delete(jobId: string, options?: Core.RequestOptions): Core.APIPromise<JobDeleteResponse> {
    return this._client.delete(`/v1/jobs/${jobId}`, options);
  }
}

export interface JobDeleteResponse {
  data: boolean;
}

export interface JobStatusResponse {
  data: JobStatusResponse.Data;
}

export namespace JobStatusResponse {
  export interface Data {
    job_id: string;

    status: string;
  }
}

export namespace Jobs {
  export import JobDeleteResponse = JobsAPI.JobDeleteResponse;
  export import JobStatusResponse = JobsAPI.JobStatusResponse;
}
