// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as JobsAPI from './jobs';
import {
  ChunkingStrategy,
  ElementType,
  JobCreateParams,
  JobDeleteResponse,
  JobListParams,
  JobListResponse,
  JobListResponsesCursor,
  Jobs,
  ParsingJob,
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
    type ParsingJob as ParsingJob,
    type ReturnFormat as ReturnFormat,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobListResponsesCursor as JobListResponsesCursor,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
  };
}
