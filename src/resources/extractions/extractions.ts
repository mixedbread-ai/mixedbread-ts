// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ContentAPI from './content';
import { Content, ContentCreateParams, ExtractionResult } from './content';
import * as JobsAPI from './jobs';
import { ExtractionJob, JobCreateParams, Jobs } from './jobs';
import * as SchemaAPI from './schema';
import {
  CreatedJsonSchema,
  EnhancedJsonSchema,
  Schema,
  SchemaCreateParams,
  SchemaEnhanceParams,
  SchemaValidateParams,
  ValidatedJsonSchema,
} from './schema';

export class Extractions extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
  schema: SchemaAPI.Schema = new SchemaAPI.Schema(this._client);
  content: ContentAPI.Content = new ContentAPI.Content(this._client);
}

Extractions.Jobs = Jobs;
Extractions.Schema = Schema;
Extractions.Content = Content;

export declare namespace Extractions {
  export { Jobs as Jobs, type ExtractionJob as ExtractionJob, type JobCreateParams as JobCreateParams };

  export {
    Schema as Schema,
    type CreatedJsonSchema as CreatedJsonSchema,
    type EnhancedJsonSchema as EnhancedJsonSchema,
    type ValidatedJsonSchema as ValidatedJsonSchema,
    type SchemaCreateParams as SchemaCreateParams,
    type SchemaEnhanceParams as SchemaEnhanceParams,
    type SchemaValidateParams as SchemaValidateParams,
  };

  export {
    Content as Content,
    type ExtractionResult as ExtractionResult,
    type ContentCreateParams as ContentCreateParams,
  };
}
