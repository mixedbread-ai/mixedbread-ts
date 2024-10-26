// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as ParseAPI from './parse';

export class DocAI extends APIResource {
  parse: ParseAPI.Parse = new ParseAPI.Parse(this._client);
}

export namespace DocAI {
  export import Parse = ParseAPI.Parse;
  export import ParseResponse = ParseAPI.ParseResponse;
  export import ParseCreateJobParams = ParseAPI.ParseCreateJobParams;
}
