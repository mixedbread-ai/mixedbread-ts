// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as CompletionsAPI from './completions';
import { CompletionCreateResponse, Completions } from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

Chat.Completions = Completions;

export declare namespace Chat {
  export { Completions as Completions, type CompletionCreateResponse as CompletionCreateResponse };
}
