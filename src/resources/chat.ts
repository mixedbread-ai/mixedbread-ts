// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Chat extends APIResource {
  /**
   * Create a chat completion, optionally grounded in the caller's stores.
   *
   * Supports the OpenAI Chat Completions API subset: a message list, function tools,
   * streaming via server-sent events, and persistence via `store`. A request without
   * hosted tools is one generation over exactly what was sent: no instructions,
   * tools, or turns are added. The `previous_completion_id` groups stored turns into
   * a conversation and restores the full model context; callers normally send only
   * the new suffix. (`previous_messages` and `terminal_tool_name` are deprecated:
   * resend the full edited history in `messages` instead.) Retrieval is opt-in:
   * declare the hosted store tools (`store_search`, `store_grep`,
   * `store_list_chunks`, `store_metadata_facets`, `list_stores`) in `tools` to let
   * the model search, grep, filter, and read the caller's stores server-side, scoped
   * by each declaration. Those executions are reported in the `hosted_tool_calls`
   * extension field (and as extra streaming chunks), with chunk results included
   * only for the requested `include` keys. A model call to a caller-declared
   * function tool ends the completion with `tool_calls` on the choice message
   * (finish_reason `tool_calls`); execute the functions and continue the
   * conversation by appending the assistant message and the matching `tool` messages
   * to the next request.
   */
  createCompletion(
    body: ChatCreateCompletionParams,
    options?: RequestOptions,
  ): APIPromise<ChatCreateCompletionResponse> {
    return this._client.post('/v1/chat/completions', { body, ...options });
  }
}

/**
 * A chat completion object, as returned by the API and persisted for retrieval.
 */
export interface ChatCreateCompletionResponse {
  id: string;

  object?: 'chat.completion';

  created: number;

  model: string;

  choices: Array<ChatCreateCompletionResponse.Choice>;

  usage?: ChatCreateCompletionResponse.Usage | null;

  metadata?: { [key: string]: string } | null;

  /**
   * Short display title of the conversation this completion belongs to (Mixedbread
   * extension)
   */
  title?: string | null;

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * store_search_call.results
   */
  hosted_tool_calls?: Array<
    | ChatCreateCompletionResponse.StoreSearchCallItem
    | ChatCreateCompletionResponse.StoreGrepCallItem
    | ChatCreateCompletionResponse.StoreListChunksCallItem
    | ChatCreateCompletionResponse.MetadataFacetsCallItem
    | ChatCreateCompletionResponse.ListStoresCallItem
  >;

  /**
   * One short-lived ticket per client-executed tool call (Mixedbread extension).
   * Send the matching ticket as the X-Mxbai-Tool-Ticket header on the store search
   * or grep you run for that call, and it bills at the discounted agent rate. Each
   * ticket redeems once.
   */
  tool_tickets?: Array<ChatCreateCompletionResponse.ToolTicket>;

  /**
   * Complete stored conversation transcript when requested through include
   */
  transcript?: Array<
    | ChatCreateCompletionResponse.SystemMessage
    | ChatCreateCompletionResponse.DeveloperMessage
    | ChatCreateCompletionResponse.UserMessage
    | ChatCreateCompletionResponse.AssistantMessageOutput
    | ChatCreateCompletionResponse.ToolMessage
  > | null;
}

export namespace ChatCreateCompletionResponse {
  export interface Choice {
    index?: number;

    /**
     * The assistant message of one completion choice.
     */
    message: Choice.Message;

    finish_reason?: 'stop' | 'tool_calls' | 'length';

    logprobs?: null;
  }

  export namespace Choice {
    /**
     * The assistant message of one completion choice.
     */
    export interface Message {
      role?: 'assistant';

      content?: string | null;

      tool_calls?: Array<Message.ToolCall> | null;

      reasoning_content?: string | null;
    }

    export namespace Message {
      /**
       * One function tool call of an assistant message.
       */
      export interface ToolCall {
        id: string;

        type?: 'function';

        function: ToolCall.Function;
      }

      export namespace ToolCall {
        export interface Function {
          name: string;

          arguments: string;
        }
      }
    }
  }

  export interface Usage {
    prompt_tokens?: number;

    completion_tokens?: number;

    total_tokens?: number;

    /**
     * Breakdown of the prompt tokens, as in the OpenAI usage object.
     */
    prompt_tokens_details?: Usage.PromptTokensDetails;
  }

  export namespace Usage {
    /**
     * Breakdown of the prompt tokens, as in the OpenAI usage object.
     */
    export interface PromptTokensDetails {
      /**
       * Prompt tokens served from the cache; part of prompt_tokens, not extra
       */
      cached_tokens?: number;
    }
  }

  /**
   * Record of one server-side store search execution.
   */
  export interface StoreSearchCallItem {
    type?: 'store_search_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    queries?: Array<string>;

    metadata_filters?: Array<StoreSearchCallItem.MetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<StoreSearchCallItem.Result> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: StoreSearchCallItem.Error | null;

    reasoning_offset?: number | null;
  }

  export namespace StoreSearchCallItem {
    /**
     * One metadata filter condition the model may attach to a hosted tool call.
     */
    export interface MetadataFilter {
      /**
       * Metadata field key
       */
      key: string;

      /**
       * Comparison operator
       */
      operator:
        | 'eq'
        | 'not_eq'
        | 'gt'
        | 'gte'
        | 'lt'
        | 'lte'
        | 'in'
        | 'not_in'
        | 'like'
        | 'contains'
        | 'starts_with'
        | 'not_like'
        | 'regex';

      /**
       * Value to compare against. Use a list for `in`/`not_in`.
       */
      value: string | number | boolean | Array<string | number | boolean> | null;
    }

    /**
     * User-facing search result chunk.
     */
    export interface Result {
      index?: number | null;

      store_id: string;

      file_id: string;

      chunk_index: number;

      filename?: string | null;

      mime_type?: string | null;

      score: number;

      text?: string | null;

      ocr_text?: string | null;

      transcription?: string | null;

      summary?: string | null;

      metadata?: unknown;

      /**
       * Metadata derived at ingestion. For chunks parsed in high-quality mode this
       * carries `layout`, whose `elements` hold the per-region bounding boxes a
       * <cite i="..." e="..."/> tag grounds to.
       */
      generated_metadata?: unknown;
    }

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    export interface Error {
      code: 'permission_denied' | 'invalid_arguments' | 'server_error';

      message: string;
    }
  }

  /**
   * Record of one server-side grep execution.
   */
  export interface StoreGrepCallItem {
    type?: 'store_grep_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    pattern?: string | null;

    targets?: Array<'text' | 'generated'> | null;

    case_sensitive?: boolean;

    metadata_filters?: Array<StoreGrepCallItem.MetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<StoreGrepCallItem.Result> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: StoreGrepCallItem.Error | null;

    reasoning_offset?: number | null;
  }

  export namespace StoreGrepCallItem {
    /**
     * One metadata filter condition the model may attach to a hosted tool call.
     */
    export interface MetadataFilter {
      /**
       * Metadata field key
       */
      key: string;

      /**
       * Comparison operator
       */
      operator:
        | 'eq'
        | 'not_eq'
        | 'gt'
        | 'gte'
        | 'lt'
        | 'lte'
        | 'in'
        | 'not_in'
        | 'like'
        | 'contains'
        | 'starts_with'
        | 'not_like'
        | 'regex';

      /**
       * Value to compare against. Use a list for `in`/`not_in`.
       */
      value: string | number | boolean | Array<string | number | boolean> | null;
    }

    /**
     * User-facing search result chunk.
     */
    export interface Result {
      index?: number | null;

      store_id: string;

      file_id: string;

      chunk_index: number;

      filename?: string | null;

      mime_type?: string | null;

      score: number;

      text?: string | null;

      ocr_text?: string | null;

      transcription?: string | null;

      summary?: string | null;

      metadata?: unknown;

      /**
       * Metadata derived at ingestion. For chunks parsed in high-quality mode this
       * carries `layout`, whose `elements` hold the per-region bounding boxes a
       * <cite i="..." e="..."/> tag grounds to.
       */
      generated_metadata?: unknown;
    }

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    export interface Error {
      code: 'permission_denied' | 'invalid_arguments' | 'server_error';

      message: string;
    }
  }

  /**
   * Record of one server-side metadata-driven chunk listing.
   */
  export interface StoreListChunksCallItem {
    type?: 'store_list_chunks_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    metadata_filters?: Array<StoreListChunksCallItem.MetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    rank_by?: string | null;

    direction?: 'asc' | 'desc';

    store?: string | null;

    results?: Array<StoreListChunksCallItem.Result> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: StoreListChunksCallItem.Error | null;

    reasoning_offset?: number | null;
  }

  export namespace StoreListChunksCallItem {
    /**
     * One metadata filter condition the model may attach to a hosted tool call.
     */
    export interface MetadataFilter {
      /**
       * Metadata field key
       */
      key: string;

      /**
       * Comparison operator
       */
      operator:
        | 'eq'
        | 'not_eq'
        | 'gt'
        | 'gte'
        | 'lt'
        | 'lte'
        | 'in'
        | 'not_in'
        | 'like'
        | 'contains'
        | 'starts_with'
        | 'not_like'
        | 'regex';

      /**
       * Value to compare against. Use a list for `in`/`not_in`.
       */
      value: string | number | boolean | Array<string | number | boolean> | null;
    }

    /**
     * User-facing search result chunk.
     */
    export interface Result {
      index?: number | null;

      store_id: string;

      file_id: string;

      chunk_index: number;

      filename?: string | null;

      mime_type?: string | null;

      score: number;

      text?: string | null;

      ocr_text?: string | null;

      transcription?: string | null;

      summary?: string | null;

      metadata?: unknown;

      /**
       * Metadata derived at ingestion. For chunks parsed in high-quality mode this
       * carries `layout`, whose `elements` hold the per-region bounding boxes a
       * <cite i="..." e="..."/> tag grounds to.
       */
      generated_metadata?: unknown;
    }

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    export interface Error {
      code: 'permission_denied' | 'invalid_arguments' | 'server_error';

      message: string;
    }
  }

  /**
   * Record of one server-side metadata facets lookup.
   */
  export interface MetadataFacetsCallItem {
    type?: 'store_metadata_facets_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    store?: string | null;

    facets?: { [key: string]: unknown } | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: MetadataFacetsCallItem.Error | null;

    reasoning_offset?: number | null;
  }

  export namespace MetadataFacetsCallItem {
    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    export interface Error {
      code: 'permission_denied' | 'invalid_arguments' | 'server_error';

      message: string;
    }
  }

  /**
   * Record of one server-side store listing execution.
   */
  export interface ListStoresCallItem {
    type?: 'list_stores_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    cursor?: string | null;

    stores?: Array<ListStoresCallItem.Store> | null;

    has_more?: boolean;

    next_cursor?: string | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ListStoresCallItem.Error | null;

    reasoning_offset?: number | null;
  }

  export namespace ListStoresCallItem {
    /**
     * One store entry returned by the hosted list stores tool.
     */
    export interface Store {
      name: string;

      description?: string | null;

      /**
       * Providers of the connectors ingesting into this store, e.g. slack or notion
       */
      connectors?: Array<string>;
    }

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    export interface Error {
      code: 'permission_denied' | 'invalid_arguments' | 'server_error';

      message: string;
    }
  }

  /**
   * Proof that one client-executed tool call belongs to this completion.
   */
  export interface ToolTicket {
    /**
     * ID of the tool call in `choices[].message.tool_calls` this covers
     */
    tool_call_id: string;

    /**
     * Opaque token to send as the X-Mxbai-Tool-Ticket header
     */
    ticket: string;

    /**
     * Unix timestamp after which the ticket no longer redeems
     */
    expires_at: number;
  }

  export interface SystemMessage {
    role: 'system';

    content: string | Array<SystemMessage.UnionMember1>;
  }

  export namespace SystemMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  /**
   * Alias of the system role; forwarded to the provider as system instructions.
   */
  export interface DeveloperMessage {
    role: 'developer';

    content: string | Array<DeveloperMessage.UnionMember1>;
  }

  export namespace DeveloperMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface UserMessage {
    role: 'user';

    content: string | Array<UserMessage.UnionMember1>;
  }

  export namespace UserMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface AssistantMessageOutput {
    role: 'assistant';

    content?: string | Array<AssistantMessageOutput.UnionMember1> | null;

    tool_calls?: Array<AssistantMessageOutput.ToolCall>;

    reasoning_content?: string | null;
  }

  export namespace AssistantMessageOutput {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }

    /**
     * One function tool call of an assistant message.
     */
    export interface ToolCall {
      id: string;

      type?: 'function';

      function: ToolCall.Function;
    }

    export namespace ToolCall {
      export interface Function {
        name: string;

        arguments: string;
      }
    }
  }

  /**
   * Result of a function tool call, sent back by the caller.
   */
  export interface ToolMessage {
    role: 'tool';

    content: string | Array<ToolMessage.UnionMember1>;

    tool_call_id: string;
  }

  export namespace ToolMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }
}

export interface ChatCreateCompletionParams {
  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  messages: Array<
    | ChatCreateCompletionParams.SystemMessage
    | ChatCreateCompletionParams.DeveloperMessage
    | ChatCreateCompletionParams.UserMessage
    | ChatCreateCompletionParams.AssistantMessageInput
    | ChatCreateCompletionParams.ToolMessage
  >;

  /**
   * Public model ID. Defaults to toast-1
   */
  model?: string;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  tools?: Array<
    | ChatCreateCompletionParams.StoreSearchTool
    | ChatCreateCompletionParams.StoreGrepTool
    | ChatCreateCompletionParams.StoreListChunksTool
    | ChatCreateCompletionParams.MetadataFacetsTool
    | ChatCreateCompletionParams.ListStoresTool
    | ChatCreateCompletionParams.FunctionTool
  >;

  /**
   * Force a call to a specific function tool, as in the OpenAI Chat Completions API.
   */
  tool_choice?:
    | 'auto'
    | 'none'
    | 'required'
    | ChatCreateCompletionParams.ToolChoiceFunction
    | ChatCreateCompletionParams.ToolChoiceStoreSearch
    | ChatCreateCompletionParams.ToolChoiceListStores
    | ChatCreateCompletionParams.ToolChoiceStoreGrep
    | ChatCreateCompletionParams.ToolChoiceStoreListChunks
    | ChatCreateCompletionParams.ToolChoiceMetadataFacets;

  /**
   * Whether to persist this completion for later retrieval
   */
  store?: boolean;

  /**
   * ID of a stored completion this one continues (Mixedbread extension). Groups
   * turns into a conversation for listing and deletion, and always restores the
   * previous completion's full model context, including hosted tool calls and
   * results
   */
  previous_completion_id?: string | null;

  /**
   * @deprecated Deprecated. Replacement for the previous completion's stored model
   * context after client-side pruning. Send the full edited history in `messages`
   * without `previous_completion_id` instead; the request is honored exactly as sent
   */
  previous_messages?: Array<
    | ChatCreateCompletionParams.SystemMessage
    | ChatCreateCompletionParams.DeveloperMessage
    | ChatCreateCompletionParams.UserMessage
    | ChatCreateCompletionParams.AssistantMessageInput
    | ChatCreateCompletionParams.ToolMessage
  > | null;

  /**
   * @deprecated Deprecated and ignored. The stored transcript is never rewritten
   * around a terminal tool call; the completion ends with the model's plain-text
   * answer
   */
  terminal_tool_name?: string | null;

  /**
   * Stream the completion as server-sent events
   */
  stream?: boolean;

  temperature?: number | null;

  top_p?: number | null;

  max_completion_tokens?: number | null;

  /**
   * Deprecated alias of max_completion_tokens, honored when it is absent
   */
  max_tokens?: number | null;

  /**
   * Maximum number of hosted retrieval calls executed for this completion
   */
  max_tool_calls?: number | null;

  /**
   * Whether the model may call multiple tools in one turn; when false, at most one
   * is honored
   */
  parallel_tool_calls?: boolean;

  metadata?: { [key: string]: string } | null;

  /**
   * Extra fields to include, e.g. store_search_call.results; unsupported values are
   * ignored
   */
  include?: Array<string> | null;
}

export namespace ChatCreateCompletionParams {
  export interface SystemMessage {
    role: 'system';

    content: string | Array<SystemMessage.UnionMember1>;
  }

  export namespace SystemMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  /**
   * Alias of the system role; forwarded to the provider as system instructions.
   */
  export interface DeveloperMessage {
    role: 'developer';

    content: string | Array<DeveloperMessage.UnionMember1>;
  }

  export namespace DeveloperMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface UserMessage {
    role: 'user';

    content: string | Array<UserMessage.UnionMember1>;
  }

  export namespace UserMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface AssistantMessageInput {
    role: 'assistant';

    content?: string | Array<AssistantMessageInput.UnionMember1> | null;

    tool_calls?: Array<AssistantMessageInput.ToolCall>;

    reasoning_content?: string | null;
  }

  export namespace AssistantMessageInput {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }

    /**
     * One function tool call of an assistant message.
     */
    export interface ToolCall {
      id: string;

      type?: 'function';

      function: ToolCall.Function;
    }

    export namespace ToolCall {
      export interface Function {
        name: string;

        arguments: string;
      }
    }
  }

  /**
   * Result of a function tool call, sent back by the caller.
   */
  export interface ToolMessage {
    role: 'tool';

    content: string | Array<ToolMessage.UnionMember1>;

    tool_call_id: string;
  }

  export namespace ToolMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  /**
   * Hosted tool: semantic search over the caller's stores, executed server-side.
   */
  export interface StoreSearchTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_search';

    /**
     * Number of chunks returned per search call
     */
    max_num_results?: number;

    /**
     * Optional filter conditions applied to every search
     */
    filters?:
      | Shared.SearchFilter
      | Shared.SearchFilterCondition
      | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
      | null;

    /**
     * Minimum similarity score threshold
     */
    score_threshold?: number;

    /**
     * Cite sources in the answer as <cite i="..."/> tags referencing result index
     * fields
     */
    citations?: boolean;
  }

  /**
   * Hosted tool: regular-expression match over a store's chunks, executed
   * server-side.
   *
   * grep runs the pattern against the literal chunk text — no embeddings, no
   * reranker. It covers exactly one store per call, so with several pinned stores
   * the model picks which of them to grep.
   */
  export interface StoreGrepTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_grep';

    /**
     * Number of chunks returned per grep call
     */
    max_num_results?: number;

    /**
     * Optional filter conditions applied to every grep
     */
    filters?:
      | Shared.SearchFilter
      | Shared.SearchFilterCondition
      | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
      | null;

    /**
     * Cite sources in the answer as <cite i="..."/> tags referencing result index
     * fields
     */
    citations?: boolean;
  }

  /**
   * Hosted tool: metadata-driven listing of a store's chunks, executed server-side.
   *
   * No embeddings and no reranker: chunks are selected by metadata filters and
   * optionally ordered by a numeric metadata field. It covers a single store per
   * call, so with several pinned stores the model picks which one to list.
   */
  export interface StoreListChunksTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_list_chunks';

    /**
     * Number of chunks returned per listing call
     */
    max_num_results?: number;

    /**
     * Optional filter conditions applied to every listing
     */
    filters?:
      | Shared.SearchFilter
      | Shared.SearchFilterCondition
      | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
      | null;

    /**
     * Cite sources in the answer as <cite i="..."/> tags referencing result index
     * fields
     */
    citations?: boolean;
  }

  /**
   * Hosted tool: metadata field/value overview of the caller's stores, executed
   * server-side.
   *
   * Facets tell the model which metadata keys exist and what their values look like,
   * so it can filter (`store_grep`, `store_list_chunks`) and phrase queries against
   * real values instead of guessing.
   */
  export interface MetadataFacetsTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_metadata_facets';

    /**
     * Optional filter conditions restricting the files the facets are computed over
     */
    filters?:
      | Shared.SearchFilter
      | Shared.SearchFilterCondition
      | Array<Shared.SearchFilter | Shared.SearchFilterCondition>
      | null;

    /**
     * Number of representative values reported per metadata field
     */
    max_values_per_field?: number;
  }

  /**
   * Hosted tool: paginated listing of the caller's stores, executed server-side.
   *
   * Pair it with the store-scoped tools that are left unpinned, so the model can
   * discover which stores it may name.
   */
  export interface ListStoresTool {
    type?: 'list_stores';

    /**
     * Number of stores returned per listing call
     */
    limit?: number;
  }

  /**
   * Client-executed function tool, as in the OpenAI Chat Completions API.
   */
  export interface FunctionTool {
    type?: 'function';

    /**
     * Definition of a client-executed function tool, as in the OpenAI Chat Completions
     * API.
     *
     * Any name is usable; hosted tool names are only reserved against the requests
     * that declare that hosted tool (checked at the params level).
     */
    function: FunctionTool.Function;
  }

  export namespace FunctionTool {
    /**
     * Definition of a client-executed function tool, as in the OpenAI Chat Completions
     * API.
     *
     * Any name is usable; hosted tool names are only reserved against the requests
     * that declare that hosted tool (checked at the params level).
     */
    export interface Function {
      name: string;

      description?: string | null;

      parameters?: { [key: string]: unknown } | null;

      strict?: boolean | null;
    }
  }

  /**
   * Force a call to a specific function tool, as in the OpenAI Chat Completions API.
   */
  export interface ToolChoiceFunction {
    type?: 'function';

    function: ToolChoiceFunction.Function;
  }

  export namespace ToolChoiceFunction {
    export interface Function {
      name: string;
    }
  }

  /**
   * Force a call to the hosted store search tool (Mixedbread extension).
   */
  export interface ToolChoiceStoreSearch {
    type?: 'store_search';
  }

  /**
   * Force a call to the hosted list stores tool (Mixedbread extension).
   */
  export interface ToolChoiceListStores {
    type?: 'list_stores';
  }

  /**
   * Force a call to the hosted store grep tool (Mixedbread extension).
   */
  export interface ToolChoiceStoreGrep {
    type?: 'store_grep';
  }

  /**
   * Force a call to the hosted list chunks tool (Mixedbread extension).
   */
  export interface ToolChoiceStoreListChunks {
    type?: 'store_list_chunks';
  }

  /**
   * Force a call to the hosted metadata facets tool (Mixedbread extension).
   */
  export interface ToolChoiceMetadataFacets {
    type?: 'store_metadata_facets';
  }

  export interface SystemMessage {
    role: 'system';

    content: string | Array<SystemMessage.UnionMember1>;
  }

  export namespace SystemMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  /**
   * Alias of the system role; forwarded to the provider as system instructions.
   */
  export interface DeveloperMessage {
    role: 'developer';

    content: string | Array<DeveloperMessage.UnionMember1>;
  }

  export namespace DeveloperMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface UserMessage {
    role: 'user';

    content: string | Array<UserMessage.UnionMember1>;
  }

  export namespace UserMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }

  export interface AssistantMessageInput {
    role: 'assistant';

    content?: string | Array<AssistantMessageInput.UnionMember1> | null;

    tool_calls?: Array<AssistantMessageInput.ToolCall>;

    reasoning_content?: string | null;
  }

  export namespace AssistantMessageInput {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }

    /**
     * One function tool call of an assistant message.
     */
    export interface ToolCall {
      id: string;

      type?: 'function';

      function: ToolCall.Function;
    }

    export namespace ToolCall {
      export interface Function {
        name: string;

        arguments: string;
      }
    }
  }

  /**
   * Result of a function tool call, sent back by the caller.
   */
  export interface ToolMessage {
    role: 'tool';

    content: string | Array<ToolMessage.UnionMember1>;

    tool_call_id: string;
  }

  export namespace ToolMessage {
    export interface UnionMember1 {
      type?: 'text';

      text: string;
    }
  }
}

export declare namespace Chat {
  export {
    type ChatCreateCompletionResponse as ChatCreateCompletionResponse,
    type ChatCreateCompletionParams as ChatCreateCompletionParams,
  };
}
