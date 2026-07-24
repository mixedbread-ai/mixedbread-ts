// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as JobsAPI from './jobs';
import {
  ChunkingStrategy,
  ElementType,
  JobCancelResponse,
  JobCreateParams,
  JobCreateResponse,
  JobDeleteResponse,
  JobListParams,
  JobListResponse,
  JobListResponsesCursor,
  JobRetrieveResponse,
  Jobs,
  ParsingJobStatus,
  ReturnFormat,
} from './jobs';

export class Parsing extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
}

Parsing.Jobs = Jobs;

export declare namespace Parsing {
  export {
    Jobs as Jobs,
    type ChunkingStrategy as ChunkingStrategy,
    type ElementType as ElementType,
    type ParsingJobStatus as ParsingJobStatus,
    type ReturnFormat as ReturnFormat,
    type JobCreateResponse as JobCreateResponse,
    type JobRetrieveResponse as JobRetrieveResponse,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobCancelResponse as JobCancelResponse,
    type JobListResponsesCursor as JobListResponsesCursor,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
