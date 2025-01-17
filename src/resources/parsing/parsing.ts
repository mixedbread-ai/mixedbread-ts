// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as JobsAPI from './jobs';
import { JobCreateParams, JobListParams, Jobs, ParsingJob, ParsingJobsLimitOffset } from './jobs';

export class Parsing extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
}

Parsing.Jobs = Jobs;
Parsing.ParsingJobsLimitOffset = ParsingJobsLimitOffset;

export declare namespace Parsing {
  export {
    Jobs as Jobs,
    type ParsingJob as ParsingJob,
    ParsingJobsLimitOffset as ParsingJobsLimitOffset,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
