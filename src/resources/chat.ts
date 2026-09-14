// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

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
   * search_corpus_call.results
   */
  hosted_tool_calls?: Array<ChatCreateCompletionResponse.HostedToolCall>;

  /**
   * Context edits applied while serving one request (Mixedbread extension).
   *
   * Only ever emitted non-empty: a request whose context was never edited carries no
   * `context_management` object at all.
   */
  context_management?: ChatCreateCompletionResponse.ContextManagement | null;

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
  transcript?: Array<ChatCreateCompletionResponse.Transcript> | null;
}

export namespace ChatCreateCompletionResponse {
  export interface Choice {
    index?: number;

    /**
     * The assistant message of one completion choice.
     */
    message: ChatCreateCompletionResponse.ChoiceMessage;

    finish_reason?: 'stop' | 'tool_calls' | 'length';

    logprobs?: unknown;
  }

  /**
   * The assistant message of one completion choice.
   */
  export interface ChoiceMessage {
    role?: 'assistant';

    content?: string | null;

    refusal?: string | null;

    tool_calls?: Array<ChatCreateCompletionResponse.ChoiceMessageToolCall> | null;

    reasoning_content?: string | null;

    annotations?: Array<ChatCreateCompletionResponse.ChoiceMessageAnnotation> | null;
  }

  /**
   * One function tool call of an assistant message.
   */
  export interface ChoiceMessageToolCall {
    id: string;

    type?: 'function';

    function: ChatCreateCompletionResponse.ChoiceMessageToolCallFunction;
  }

  export interface ChoiceMessageToolCallFunction {
    name: string;

    arguments: string;
  }

  /**
   * The OpenAI ``file_citation`` annotation, plus the chunk it points at.
   *
   * ``chunk_id`` is the same ``file_id:chunk_index`` reference every hosted result
   * carries, and ``store_id`` the store whose index holds the chunk; the cited text
   * and score are on the included tool results.
   */
  export interface ChoiceMessageAnnotation {
    type?: 'file_citation';

    file_id: string;

    filename: string;

    index: number;

    chunk_id: string;

    store_id: string;
  }

  export interface Usage {
    prompt_tokens?: number;

    completion_tokens?: number;

    total_tokens?: number;

    /**
     * Breakdown of the prompt tokens, as in the OpenAI usage object.
     */
    prompt_tokens_details?: ChatCreateCompletionResponse.UsagePromptTokensDetails;

    /**
     * Breakdown of the completion tokens, as in the OpenAI usage object.
     */
    completion_tokens_details?: ChatCreateCompletionResponse.UsageCompletionTokensDetails;
  }

  /**
   * Breakdown of the prompt tokens, as in the OpenAI usage object.
   */
  export interface UsagePromptTokensDetails {
    /**
     * Prompt tokens served from the cache; part of prompt_tokens, not extra
     */
    cached_tokens?: number;
  }

  /**
   * Breakdown of the completion tokens, as in the OpenAI usage object.
   */
  export interface UsageCompletionTokensDetails {
    /**
     * Tokens of the hosted loop's narration; part of completion_tokens, not extra
     */
    reasoning_tokens?: number;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallSearchCorpusCallItem {
    type?: 'search_corpus_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    queries?: Array<string>;

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallSearchCorpusCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallSearchCorpusCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallSearchCorpusCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallSearchCorpusCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallGrepCallItem {
    type?: 'grep_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    pattern?: string | null;

    targets?: Array<'text' | 'generated'> | null;

    case_sensitive?: boolean;

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallGrepCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallGrepCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallGrepCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallGrepCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallFilterChunksCallItem {
    type?: 'filter_chunks_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallFilterChunksCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    rank_by?: string | null;

    direction?: 'asc' | 'desc';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallFilterChunksCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallFilterChunksCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallFilterChunksCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallInspectMetadataCallItem {
    type?: 'inspect_metadata_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    store?: string | null;

    facets?: { [key: string]: unknown } | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallInspectMetadataCallItemError | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallInspectMetadataCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallGetChunksCallItem {
    type?: 'get_chunks_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    chunk_ids?: Array<string>;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallGetChunksCallItemError | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallGetChunksCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallStoreSearchCallItem {
    type?: 'store_search_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    queries?: Array<string>;

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallStoreSearchCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallStoreSearchCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallStoreSearchCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallStoreSearchCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallStoreGrepCallItem {
    type?: 'store_grep_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    pattern?: string | null;

    targets?: Array<'text' | 'generated'> | null;

    case_sensitive?: boolean;

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallStoreGrepCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallStoreGrepCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallStoreGrepCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallStoreGrepCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallStoreListChunksCallItem {
    type?: 'store_list_chunks_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    metadata_filters?: Array<ChatCreateCompletionResponse.HostedToolCallStoreListChunksCallItemMetadataFilter> | null;

    filter_mode?: 'all' | 'any';

    rank_by?: string | null;

    direction?: 'asc' | 'desc';

    store?: string | null;

    results?: Array<{ [key: string]: unknown }> | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallStoreListChunksCallItemError | null;
  }

  /**
   * One metadata filter condition the model may attach to a hosted tool call.
   */
  export interface HostedToolCallStoreListChunksCallItemMetadataFilter {
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
    value: string | number | number | boolean | Array<string | number | number | boolean> | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallStoreListChunksCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallMetadataFacetsCallItem {
    type?: 'store_metadata_facets_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    store?: string | null;

    facets?: { [key: string]: unknown } | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallMetadataFacetsCallItemError | null;
  }

  /**
   * Machine-readable reason a hosted tool call failed (Mixedbread extension).
   */
  export interface HostedToolCallMetadataFacetsCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  /**
   * Server-side hosted tool executions of this completion (Mixedbread extension);
   * chunk results ride along only for requested include keys, e.g.
   * search_corpus_call.results
   */
  export interface HostedToolCallListStoresCallItem {
    type?: 'list_stores_call';

    id: string;

    status?: 'in_progress' | 'completed' | 'failed';

    cursor?: string | null;

    stores?: Array<ChatCreateCompletionResponse.HostedToolCallListStoresCallItemStore> | null;

    has_more?: boolean;

    next_cursor?: string | null;

    /**
     * Machine-readable reason a hosted tool call failed (Mixedbread extension).
     */
    error?: ChatCreateCompletionResponse.HostedToolCallListStoresCallItemError | null;
  }

  /**
   * One store entry returned by the hosted list stores tool.
   */
  export interface HostedToolCallListStoresCallItemStore {
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
  export interface HostedToolCallListStoresCallItemError {
    code: 'permission_denied' | 'invalid_arguments' | 'server_error';

    message: string;
  }

  export type HostedToolCall =
    | ChatCreateCompletionResponse.HostedToolCallSearchCorpusCallItem
    | ChatCreateCompletionResponse.HostedToolCallGrepCallItem
    | ChatCreateCompletionResponse.HostedToolCallFilterChunksCallItem
    | ChatCreateCompletionResponse.HostedToolCallInspectMetadataCallItem
    | ChatCreateCompletionResponse.HostedToolCallGetChunksCallItem
    | ChatCreateCompletionResponse.HostedToolCallStoreSearchCallItem
    | ChatCreateCompletionResponse.HostedToolCallStoreGrepCallItem
    | ChatCreateCompletionResponse.HostedToolCallStoreListChunksCallItem
    | ChatCreateCompletionResponse.HostedToolCallMetadataFacetsCallItem
    | ChatCreateCompletionResponse.HostedToolCallListStoresCallItem;

  /**
   * Context edits applied while serving one request (Mixedbread extension).
   *
   * Only ever emitted non-empty: a request whose context was never edited carries no
   * `context_management` object at all.
   */
  export interface ContextManagement {
    applied_edits: Array<ChatCreateCompletionResponse.ContextManagementAppliedEdit>;
  }

  /**
   * Aggregate of the model's prune_context calls in one request.
   */
  export interface ContextManagementAppliedEditAppliedPruneContextEdit {
    type?: 'prune_context';

    /**
     * Number of prune_context calls the model made in this request
     */
    calls: number;

    /**
     * Input tokens cleared from the model's context
     */
    cleared_input_tokens: number;
  }

  /**
   * One caller tool result shortened by the server's context-overflow recovery.
   */
  export interface ContextManagementAppliedEditAppliedTruncateToolResultEdit {
    type?: 'truncate_tool_result';

    /**
     * ID of the tool call whose result was shortened
     */
    tool_call_id: string;

    /**
     * Input tokens cleared from the model's context
     */
    cleared_input_tokens: number;
  }

  export type ContextManagementAppliedEdit =
    | ChatCreateCompletionResponse.ContextManagementAppliedEditAppliedPruneContextEdit
    | ChatCreateCompletionResponse.ContextManagementAppliedEditAppliedTruncateToolResultEdit;

  /**
   * One short-lived ticket per client-executed tool call (Mixedbread extension).
   * Send the matching ticket as the X-Mxbai-Tool-Ticket header on the store search
   * or grep you run for that call, and it bills at the discounted agent rate. Each
   * ticket redeems once.
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

  /**
   * Complete stored conversation transcript when requested through include
   */
  export interface TranscriptSystemMessage {
    role: 'system';

    content: string | Array<ChatCreateCompletionResponse.TranscriptSystemMessageContentUnionMember1>;
  }

  export interface TranscriptSystemMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Complete stored conversation transcript when requested through include
   */
  export interface TranscriptDeveloperMessage {
    role: 'developer';

    content: string | Array<ChatCreateCompletionResponse.TranscriptDeveloperMessageContentUnionMember1>;
  }

  export interface TranscriptDeveloperMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Complete stored conversation transcript when requested through include
   */
  export interface TranscriptUserMessage {
    role: 'user';

    content: string | Array<ChatCreateCompletionResponse.TranscriptUserMessageContentUnionMember1>;
  }

  export interface TranscriptUserMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Complete stored conversation transcript when requested through include
   */
  export interface TranscriptAssistantMessageOutput {
    role: 'assistant';

    content?:
      | string
      | Array<ChatCreateCompletionResponse.TranscriptAssistantMessageOutputContentUnionMember1>
      | null;

    tool_calls?: Array<ChatCreateCompletionResponse.TranscriptAssistantMessageOutputToolCall>;

    reasoning_content?: string | null;

    annotations?: Array<ChatCreateCompletionResponse.TranscriptAssistantMessageOutputAnnotation>;
  }

  export interface TranscriptAssistantMessageOutputContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * One function tool call of an assistant message.
   */
  export interface TranscriptAssistantMessageOutputToolCall {
    id: string;

    type?: 'function';

    function: ChatCreateCompletionResponse.TranscriptAssistantMessageOutputToolCallFunction;
  }

  export interface TranscriptAssistantMessageOutputToolCallFunction {
    name: string;

    arguments: string;
  }

  /**
   * The OpenAI ``file_citation`` annotation, plus the chunk it points at.
   *
   * ``chunk_id`` is the same ``file_id:chunk_index`` reference every hosted result
   * carries, and ``store_id`` the store whose index holds the chunk; the cited text
   * and score are on the included tool results.
   */
  export interface TranscriptAssistantMessageOutputAnnotation {
    type?: 'file_citation';

    file_id: string;

    filename: string;

    index: number;

    chunk_id: string;

    store_id: string;
  }

  /**
   * Complete stored conversation transcript when requested through include
   */
  export interface TranscriptToolMessage {
    role: 'tool';

    content: string | Array<ChatCreateCompletionResponse.TranscriptToolMessageContentUnionMember1>;

    tool_call_id: string;
  }

  export interface TranscriptToolMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  export type Transcript =
    | ChatCreateCompletionResponse.TranscriptSystemMessage
    | ChatCreateCompletionResponse.TranscriptDeveloperMessage
    | ChatCreateCompletionResponse.TranscriptUserMessage
    | ChatCreateCompletionResponse.TranscriptAssistantMessageOutput
    | ChatCreateCompletionResponse.TranscriptToolMessage;
}

export interface ChatCreateCompletionParams {
  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  messages: Array<ChatCreateCompletionParams.Message>;

  /**
   * Public model ID. Defaults to toast-1
   */
  model?: string;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  tools?: Array<ChatCreateCompletionParams.Tool>;

  tool_choice?: ChatCreateCompletionParams.ToolChoice;

  /**
   * The shape of the answer: plain text, any JSON object, or JSON matching a schema.
   * A JSON answer is grammar-constrained on the final generation; tool calls are
   * unaffected
   */
  response_format?: ChatCreateCompletionParams.ResponseFormat | null;

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
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  previous_messages?: Array<ChatCreateCompletionParams.PreviousMessage> | null;

  /**
   * Deprecated and ignored. The stored transcript is never rewritten around a
   * terminal tool call; the completion ends with the model's plain-text answer
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
   * Maximum number of server-handled tool calls (store tools and prune_context)
   * executed for this completion; ignored when none are declared
   */
  max_tool_calls?: number | null;

  /**
   * Opt-in context editing for one completion (Mixedbread extension).
   */
  context_management?: ChatCreateCompletionParams.ContextManagement | null;

  /**
   * Whether the model may call multiple tools in one turn; when false, at most one
   * is honored
   */
  parallel_tool_calls?: boolean;

  metadata?: { [key: string]: string } | null;

  /**
   * Extra fields to include, e.g. search_corpus_call.results; unsupported values are
   * ignored
   */
  include?: Array<string> | null;
}

export namespace ChatCreateCompletionParams {
  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  export interface MessageSystemMessage {
    role: 'system';

    content: string | Array<ChatCreateCompletionParams.MessageSystemMessageContentUnionMember1>;
  }

  export interface MessageSystemMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  export interface MessageDeveloperMessage {
    role: 'developer';

    content: string | Array<ChatCreateCompletionParams.MessageDeveloperMessageContentUnionMember1>;
  }

  export interface MessageDeveloperMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  export interface MessageUserMessage {
    role: 'user';

    content: string | Array<ChatCreateCompletionParams.MessageUserMessageContentUnionMember1>;
  }

  export interface MessageUserMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  export interface MessageAssistantMessageInput {
    role: 'assistant';

    content?:
      | string
      | Array<ChatCreateCompletionParams.MessageAssistantMessageInputContentUnionMember1>
      | null;

    tool_calls?: Array<ChatCreateCompletionParams.MessageAssistantMessageInputToolCall>;

    reasoning_content?: string | null;

    annotations?: Array<ChatCreateCompletionParams.MessageAssistantMessageInputAnnotation>;
  }

  export interface MessageAssistantMessageInputContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * One function tool call of an assistant message.
   */
  export interface MessageAssistantMessageInputToolCall {
    id: string;

    type?: 'function';

    function: ChatCreateCompletionParams.MessageAssistantMessageInputToolCallFunction;
  }

  export interface MessageAssistantMessageInputToolCallFunction {
    name: string;

    arguments: string;
  }

  /**
   * The OpenAI ``file_citation`` annotation, plus the chunk it points at.
   *
   * ``chunk_id`` is the same ``file_id:chunk_index`` reference every hosted result
   * carries, and ``store_id`` the store whose index holds the chunk; the cited text
   * and score are on the included tool results.
   */
  export interface MessageAssistantMessageInputAnnotation {
    type?: 'file_citation';

    file_id: string;

    filename: string;

    index: number;

    chunk_id: string;

    store_id: string;
  }

  /**
   * The conversation, or its new suffix when continuing a stored completion
   */
  export interface MessageToolMessage {
    role: 'tool';

    content: string | Array<ChatCreateCompletionParams.MessageToolMessageContentUnionMember1>;

    tool_call_id: string;
  }

  export interface MessageToolMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  export type Message =
    | ChatCreateCompletionParams.MessageSystemMessage
    | ChatCreateCompletionParams.MessageDeveloperMessage
    | ChatCreateCompletionParams.MessageUserMessage
    | ChatCreateCompletionParams.MessageAssistantMessageInput
    | ChatCreateCompletionParams.MessageToolMessage;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolSearchCorpusTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'search_corpus';

    /**
     * Optional filter conditions applied to every search
     */
    filters?: ChatCreateCompletionParams.ToolSearchCorpusToolFilters | null;

    /**
     * Minimum similarity score threshold
     */
    score_threshold?: number;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolSearchCorpusToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolSearchCorpusToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolSearchCorpusToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolGrepTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'grep';

    /**
     * Optional filter conditions applied to every grep
     */
    filters?: ChatCreateCompletionParams.ToolGrepToolFilters | null;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolGrepToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolGrepToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolGrepToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolFilterChunksTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'filter_chunks';

    /**
     * Optional filter conditions applied to every listing
     */
    filters?: ChatCreateCompletionParams.ToolFilterChunksToolFilters | null;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolFilterChunksToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolFilterChunksToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolFilterChunksToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolInspectMetadataTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'inspect_metadata';

    /**
     * Optional filter conditions restricting the files the facets are computed over
     */
    filters?: ChatCreateCompletionParams.ToolInspectMetadataToolFilters | null;
  }

  export type ToolInspectMetadataToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolInspectMetadataToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolInspectMetadataToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolGetChunksTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'get_chunks';
  }

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolStoreSearchTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_search';

    /**
     * Optional filter conditions applied to every search
     */
    filters?: ChatCreateCompletionParams.ToolStoreSearchToolFilters | null;

    /**
     * Minimum similarity score threshold
     */
    score_threshold?: number;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolStoreSearchToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolStoreSearchToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolStoreSearchToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolStoreGrepTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_grep';

    /**
     * Optional filter conditions applied to every grep
     */
    filters?: ChatCreateCompletionParams.ToolStoreGrepToolFilters | null;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolStoreGrepToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolStoreGrepToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolStoreGrepToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolStoreListChunksTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_list_chunks';

    /**
     * Optional filter conditions applied to every listing
     */
    filters?: ChatCreateCompletionParams.ToolStoreListChunksToolFilters | null;

    /**
     * Have the model cite its evidence inline; the answer ships with the markers
     * removed and an annotations list of file_citation entries pointing at the cited
     * chunks
     */
    citations?: boolean;
  }

  export type ToolStoreListChunksToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolStoreListChunksToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolStoreListChunksToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolMetadataFacetsTool {
    /**
     * IDs or names of the stores the tool runs against; omit to let the model pick a
     * store per call (requires the list_stores tool)
     */
    store_identifiers?: Array<string> | null;

    type?: 'store_metadata_facets';

    /**
     * Optional filter conditions restricting the files the facets are computed over
     */
    filters?: ChatCreateCompletionParams.ToolMetadataFacetsToolFilters | null;
  }

  export type ToolMetadataFacetsToolFiltersUnionMember2 = Shared.SearchFilter | Shared.SearchFilterCondition;

  export type ToolMetadataFacetsToolFilters =
    | Shared.SearchFilter
    | Shared.SearchFilterCondition
    | Array<ChatCreateCompletionParams.ToolMetadataFacetsToolFiltersUnionMember2>
    | null;

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolListStoresTool {
    type?: 'list_stores';

    /**
     * Number of stores returned per listing call
     */
    limit?: number;
  }

  /**
   * Tools the model may call; the hosted tools are opt-in and run server-side for
   * the completions that declare them
   */
  export interface ToolFunctionTool {
    type?: 'function';

    /**
     * Definition of a client-executed function tool, as in the OpenAI Chat Completions
     * API.
     *
     * Any name is usable; hosted tool names are only reserved against the requests
     * that declare that hosted tool (checked at the params level).
     */
    function: ChatCreateCompletionParams.ToolFunctionToolFunction;
  }

  /**
   * Definition of a client-executed function tool, as in the OpenAI Chat Completions
   * API.
   *
   * Any name is usable; hosted tool names are only reserved against the requests
   * that declare that hosted tool (checked at the params level).
   */
  export interface ToolFunctionToolFunction {
    name: string;

    description?: string | null;

    parameters?: { [key: string]: unknown } | null;

    strict?: boolean | null;
  }

  export type Tool =
    | ChatCreateCompletionParams.ToolSearchCorpusTool
    | ChatCreateCompletionParams.ToolGrepTool
    | ChatCreateCompletionParams.ToolFilterChunksTool
    | ChatCreateCompletionParams.ToolInspectMetadataTool
    | ChatCreateCompletionParams.ToolGetChunksTool
    | ChatCreateCompletionParams.ToolStoreSearchTool
    | ChatCreateCompletionParams.ToolStoreGrepTool
    | ChatCreateCompletionParams.ToolStoreListChunksTool
    | ChatCreateCompletionParams.ToolMetadataFacetsTool
    | ChatCreateCompletionParams.ToolListStoresTool
    | ChatCreateCompletionParams.ToolFunctionTool;

  /**
   * Force a call to a specific function tool, as in the OpenAI Chat Completions API.
   */
  export interface ToolChoiceToolChoiceFunction {
    type?: 'function';

    function: ChatCreateCompletionParams.ToolChoiceToolChoiceFunctionFunction;
  }

  export interface ToolChoiceToolChoiceFunctionFunction {
    name: string;
  }

  /**
   * Force a call to the hosted search tool (Mixedbread extension).
   */
  export interface ToolChoiceToolChoiceSearchCorpus {
    type?: 'search_corpus';
  }

  /**
   * Force a call to the hosted grep tool (Mixedbread extension).
   */
  export interface ToolChoiceToolChoiceGrep {
    type?: 'grep';
  }

  /**
   * Force a call to the hosted chunk-listing tool (Mixedbread extension).
   */
  export interface ToolChoiceToolChoiceFilterChunks {
    type?: 'filter_chunks';
  }

  /**
   * Force a call to the hosted metadata-overview tool (Mixedbread extension).
   */
  export interface ToolChoiceToolChoiceInspectMetadata {
    type?: 'inspect_metadata';
  }

  /**
   * Force a call to the hosted list stores tool (Mixedbread extension).
   */
  export interface ToolChoiceToolChoiceListStores {
    type?: 'list_stores';
  }

  /**
   * Deprecated alias of the `search_corpus` tool choice.
   */
  export interface ToolChoiceToolChoiceStoreSearch {
    type?: 'store_search';
  }

  /**
   * Deprecated alias of the `grep` tool choice.
   */
  export interface ToolChoiceToolChoiceStoreGrep {
    type?: 'store_grep';
  }

  /**
   * Deprecated alias of the `filter_chunks` tool choice.
   */
  export interface ToolChoiceToolChoiceStoreListChunks {
    type?: 'store_list_chunks';
  }

  /**
   * Deprecated alias of the `inspect_metadata` tool choice.
   */
  export interface ToolChoiceToolChoiceMetadataFacets {
    type?: 'store_metadata_facets';
  }

  export type ToolChoice =
    | 'auto'
    | 'none'
    | 'required'
    | ChatCreateCompletionParams.ToolChoiceToolChoiceFunction
    | ChatCreateCompletionParams.ToolChoiceToolChoiceSearchCorpus
    | ChatCreateCompletionParams.ToolChoiceToolChoiceGrep
    | ChatCreateCompletionParams.ToolChoiceToolChoiceFilterChunks
    | ChatCreateCompletionParams.ToolChoiceToolChoiceInspectMetadata
    | ChatCreateCompletionParams.ToolChoiceToolChoiceListStores
    | ChatCreateCompletionParams.ToolChoiceToolChoiceStoreSearch
    | ChatCreateCompletionParams.ToolChoiceToolChoiceStoreGrep
    | ChatCreateCompletionParams.ToolChoiceToolChoiceStoreListChunks
    | ChatCreateCompletionParams.ToolChoiceToolChoiceMetadataFacets;

  /**
   * The shape of the answer: plain text, any JSON object, or JSON matching a schema.
   * A JSON answer is grammar-constrained on the final generation; tool calls are
   * unaffected
   */
  export interface ResponseFormatResponseFormatText {
    type?: 'text';
  }

  /**
   * The shape of the answer: plain text, any JSON object, or JSON matching a schema.
   * A JSON answer is grammar-constrained on the final generation; tool calls are
   * unaffected
   */
  export interface ResponseFormatResponseFormatJsonObject {
    type?: 'json_object';
  }

  /**
   * The shape of the answer: plain text, any JSON object, or JSON matching a schema.
   * A JSON answer is grammar-constrained on the final generation; tool calls are
   * unaffected
   */
  export interface ResponseFormatResponseFormatJsonSchema {
    type?: 'json_schema';

    /**
     * The schema of a `json_schema` response format, as in the OpenAI API.
     */
    json_schema: ChatCreateCompletionParams.ResponseFormatResponseFormatJsonSchemaJsonSchema;
  }

  /**
   * The schema of a `json_schema` response format, as in the OpenAI API.
   */
  export interface ResponseFormatResponseFormatJsonSchemaJsonSchema {
    name: string;

    /**
     * The JSON schema the answer must match; decoding is constrained to it. The
     * dialect is JSON Schema 2020-12 (`$schema`, if given, names it at the root only).
     * References must point into the schema itself, `pattern` and `patternProperties`
     * regexes use RE2 syntax (no backreferences or lookaround), and
     * `unevaluatedProperties` cannot be combined with `patternProperties`
     */
    schema: { [key: string]: unknown };

    description?: string | null;

    /**
     * Accepted for compatibility. The answer is grammar-constrained to the schema
     * either way, and the schema is not narrowed to OpenAI's strict subset
     */
    strict?: boolean | null;
  }

  export type ResponseFormat =
    | ChatCreateCompletionParams.ResponseFormatResponseFormatText
    | ChatCreateCompletionParams.ResponseFormatResponseFormatJsonObject
    | ChatCreateCompletionParams.ResponseFormatResponseFormatJsonSchema
    | null;

  /**
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  export interface PreviousMessageSystemMessage {
    role: 'system';

    content: string | Array<ChatCreateCompletionParams.PreviousMessageSystemMessageContentUnionMember1>;
  }

  export interface PreviousMessageSystemMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  export interface PreviousMessageDeveloperMessage {
    role: 'developer';

    content: string | Array<ChatCreateCompletionParams.PreviousMessageDeveloperMessageContentUnionMember1>;
  }

  export interface PreviousMessageDeveloperMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  export interface PreviousMessageUserMessage {
    role: 'user';

    content: string | Array<ChatCreateCompletionParams.PreviousMessageUserMessageContentUnionMember1>;
  }

  export interface PreviousMessageUserMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  export interface PreviousMessageAssistantMessageInput {
    role: 'assistant';

    content?:
      | string
      | Array<ChatCreateCompletionParams.PreviousMessageAssistantMessageInputContentUnionMember1>
      | null;

    tool_calls?: Array<ChatCreateCompletionParams.PreviousMessageAssistantMessageInputToolCall>;

    reasoning_content?: string | null;

    annotations?: Array<ChatCreateCompletionParams.PreviousMessageAssistantMessageInputAnnotation>;
  }

  export interface PreviousMessageAssistantMessageInputContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  /**
   * One function tool call of an assistant message.
   */
  export interface PreviousMessageAssistantMessageInputToolCall {
    id: string;

    type?: 'function';

    function: ChatCreateCompletionParams.PreviousMessageAssistantMessageInputToolCallFunction;
  }

  export interface PreviousMessageAssistantMessageInputToolCallFunction {
    name: string;

    arguments: string;
  }

  /**
   * The OpenAI ``file_citation`` annotation, plus the chunk it points at.
   *
   * ``chunk_id`` is the same ``file_id:chunk_index`` reference every hosted result
   * carries, and ``store_id`` the store whose index holds the chunk; the cited text
   * and score are on the included tool results.
   */
  export interface PreviousMessageAssistantMessageInputAnnotation {
    type?: 'file_citation';

    file_id: string;

    filename: string;

    index: number;

    chunk_id: string;

    store_id: string;
  }

  /**
   * Deprecated. Replacement for the previous completion's stored model context after
   * client-side pruning. Send the full edited history in `messages` without
   * `previous_completion_id` instead; the request is honored exactly as sent
   */
  export interface PreviousMessageToolMessage {
    role: 'tool';

    content: string | Array<ChatCreateCompletionParams.PreviousMessageToolMessageContentUnionMember1>;

    tool_call_id: string;
  }

  export interface PreviousMessageToolMessageContentUnionMember1 {
    type?: 'text';

    text: string;
  }

  export type PreviousMessage =
    | ChatCreateCompletionParams.PreviousMessageSystemMessage
    | ChatCreateCompletionParams.PreviousMessageDeveloperMessage
    | ChatCreateCompletionParams.PreviousMessageUserMessage
    | ChatCreateCompletionParams.PreviousMessageAssistantMessageInput
    | ChatCreateCompletionParams.PreviousMessageToolMessage;

  /**
   * Opt-in context editing for one completion (Mixedbread extension).
   */
  export interface ContextManagement {
    /**
     * The context edits enabled for this completion
     */
    edits: Array<ChatCreateCompletionParams.ContextManagementEdit>;
  }

  /**
   * The context edits enabled for this completion
   */
  export interface ContextManagementEdit {
    type?: 'prune_context';
  }
}

export declare namespace Chat {
  export {
    type ChatCreateCompletionResponse as ChatCreateCompletionResponse,
    type ChatCreateCompletionParams as ChatCreateCompletionParams,
  };
}
