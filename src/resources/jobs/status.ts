// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as JobsAPI from './jobs';

export class Status extends APIResource {
  /**
   * Retrieve the status of a specific job by its ID.
   *
   * Args: job_id: The ID of the job to retrieve the status for. state: The
   * application state.
   *
   * Returns: JobStatusResponse: The response containing the job status.
   */
  retrieve(jobId: string, options?: Core.RequestOptions): Core.APIPromise<JobsAPI.JobStatusResponse> {
    return this._client.get(`/v1/jobs/${jobId}`, options);
  }
}
