// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as ParseAPI from './parse/parse';
import { Parse } from './parse/parse';

export class DocumentAI extends APIResource {
  parse: ParseAPI.Parse = new ParseAPI.Parse(this._client);
}

DocumentAI.Parse = Parse;

export declare namespace DocumentAI {
  export { Parse as Parse };
}
