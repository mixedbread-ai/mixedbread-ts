// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as JobsAPI from './jobs';
import {
  Chunk,
  ChunkElement,
  ChunkingStrategy,
  DocumentParserResult,
  ElementType,
  JobCreateParams,
  JobDeleteResponse,
  JobListParams,
  JobListResponse,
  JobListResponsesCursor,
  Jobs,
  ParsingJob,
  ParsingJobHelpers,
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
    type ParsingJob as ParsingJob,
    type DocumentParserResult as DocumentParserResult,
    type Chunk as Chunk,
    type ChunkElement as ChunkElement,
    type JobListResponse as JobListResponse,
    type JobDeleteResponse as JobDeleteResponse,
    type JobListResponsesCursor as JobListResponsesCursor,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
    type ParsingJobHelpers as ParsingJobHelpers,
  };
}
