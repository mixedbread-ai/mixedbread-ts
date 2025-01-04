// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as ParseAPI from './parse';
import { Parse, ParseCreateJobParams, ParseCreateJobResponse, ParseRetrieveJobResponse } from './parse';
import * as ExtractAPI from './extract/extract';
import {
  Extract,
  ExtractContentParams,
  ExtractCreateJobParams,
  ExtractCreateJobResponse,
  ExtractRetrieveJobResponse,
  Result,
} from './extract/extract';

export class DocumentAI extends APIResource {
  parse: ParseAPI.Parse = new ParseAPI.Parse(this._client);
  extract: ExtractAPI.Extract = new ExtractAPI.Extract(this._client);
}

DocumentAI.Parse = Parse;
DocumentAI.Extract = Extract;

export declare namespace DocumentAI {
  export {
    Parse as Parse,
    type ParseCreateJobResponse as ParseCreateJobResponse,
    type ParseRetrieveJobResponse as ParseRetrieveJobResponse,
    type ParseCreateJobParams as ParseCreateJobParams,
  };

  export {
    Extract as Extract,
    type Result as Result,
    type ExtractCreateJobResponse as ExtractCreateJobResponse,
    type ExtractRetrieveJobResponse as ExtractRetrieveJobResponse,
    type ExtractContentParams as ExtractContentParams,
    type ExtractCreateJobParams as ExtractCreateJobParams,
  };
}
