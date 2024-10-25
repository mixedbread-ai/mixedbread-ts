// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as ParseAPI from './parse';

export class Di extends APIResource {
  parse: ParseAPI.Parse = new ParseAPI.Parse(this._client);
}

export namespace Di {
  export import Parse = ParseAPI.Parse;
  export import ParseResponse = ParseAPI.ParseResponse;
  export import ParseCreateParams = ParseAPI.ParseCreateParams;
}
