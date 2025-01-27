// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as JobsAPI from './jobs';
import {
  JobCreateParams,
  JobDeleteResponse,
  JobListParams,
  JobListResponse,
  JobListResponsesLimitOffset,
  Jobs,
  ParsingJob,
} from './jobs';

export class Parsing extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
}

Parsing.Jobs = Jobs;
Parsing.JobListResponsesLimitOffset = JobListResponsesLimitOffset;

export declare namespace Parsing {
  export {
    Jobs as Jobs,
    type ParsingJob as ParsingJob,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    JobListResponsesLimitOffset as JobListResponsesLimitOffset,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
