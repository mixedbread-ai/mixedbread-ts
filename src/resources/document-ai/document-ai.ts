// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as ParseAPI from './parse';
import { Parse, ParseCreateJobParams, ParseCreateJobResponse, ParseRetrieveJobResponse } from './parse';

export class DocumentAI extends APIResource {
  parse: ParseAPI.Parse = new ParseAPI.Parse(this._client);
}

DocumentAI.Parse = Parse;

export declare namespace DocumentAI {
  export {
    Parse as Parse,
    type ParseCreateJobResponse as ParseCreateJobResponse,
    type ParseRetrieveJobResponse as ParseRetrieveJobResponse,
    type ParseCreateJobParams as ParseCreateJobParams,
  };
}
