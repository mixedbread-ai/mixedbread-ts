// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as JobsAPI from './jobs';
import { JobCreateParams, JobCreateResponse, JobRetrieveResponse, Jobs } from './jobs';

export class Parse extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
}

Parse.Jobs = Jobs;

export declare namespace Parse {
  export {
    Jobs as Jobs,
    type JobCreateResponse as JobCreateResponse,
    type JobRetrieveResponse as JobRetrieveResponse,
    type JobCreateParams as JobCreateParams,
  };
}
