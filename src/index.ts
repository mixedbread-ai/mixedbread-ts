// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { type Agent } from './_shims/index';
import * as Core from './core';
import * as Errors from './error';
import * as Uploads from './uploads';
import * as API from './resources/index';
import { CompletionCreateResponse, Completions } from './resources/completions';
import { EmbeddingCreateParams, EmbeddingCreateResponse, Embeddings } from './resources/embeddings';
import { Reranking, RerankingCreateParams, RerankingCreateResponse } from './resources/reranking';
import { InfoResponse, ServiceInfo } from './resources/service-info';
import { Extractions } from './resources/extractions/extractions';
import {
  FileCreateParams,
  FileDeleted,
  FileListParams,
  FileListResponse,
  FileObject,
  FileUpdateParams,
  Files,
} from './resources/files/files';
import { Parsing } from './resources/parsing/parsing';
import {
  SearchFilter,
  SearchFilterCondition,
  VectorStore,
  VectorStoreCreateParams,
  VectorStoreDeleted,
  VectorStoreListParams,
  VectorStoreListResponse,
  VectorStoreQuestionAnsweringParams,
  VectorStoreQuestionAnsweringResponse,
  VectorStoreSearchParams,
  VectorStoreSearchResponse,
  VectorStoreUpdateParams,
  VectorStores,
} from './resources/vector-stores/vector-stores';

const environments = {
  production: 'https://api.mixedbread.ai',
  environment_1: 'http://127.0.0.1:8000',
};
type Environment = keyof typeof environments;

export interface ClientOptions {
  /**
   * Api key to access Mixedbreads API
   */
  apiKey?: string | undefined;

  /**
   * Specifies the environment to use for the API.
   *
   * Each environment maps to a different base URL:
   * - `production` corresponds to `https://api.mixedbread.ai`
   * - `environment_1` corresponds to `http://127.0.0.1:8000`
   */
  environment?: Environment;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['MIXEDBREAD_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   */
  timeout?: number;

  /**
   * An HTTP agent used to manage HTTP(S) connections.
   *
   * If not provided, an agent will be constructed by default in the Node.js environment,
   * otherwise no agent is used.
   */
  httpAgent?: Agent;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * If not provided, we use `node-fetch` on Node.js and otherwise expect that `fetch` is
   * defined globally.
   */
  fetch?: Core.Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `undefined` or `null` in request options.
   */
  defaultHeaders?: Core.Headers;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Core.DefaultQuery;
}

/**
 * API Client for interfacing with the Mixedbread API.
 */
export class Mixedbread extends Core.APIClient {
  apiKey: string;

  private _options: ClientOptions;

  /**
   * API Client for interfacing with the Mixedbread API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['API_KEY'] ?? undefined]
   * @param {Environment} [opts.environment=production] - Specifies the environment URL to use for the API.
   * @param {string} [opts.baseURL=process.env['MIXEDBREAD_BASE_URL'] ?? https://api.mixedbread.ai] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({
    baseURL = Core.readEnv('MIXEDBREAD_BASE_URL'),
    apiKey = Core.readEnv('API_KEY'),
    ...opts
  }: ClientOptions = {}) {
    if (apiKey === undefined) {
      throw new Errors.MixedbreadError(
        "The API_KEY environment variable is missing or empty; either provide it, or instantiate the Mixedbread client with an apiKey option, like new Mixedbread({ apiKey: 'My API Key' }).",
      );
    }

    const options: ClientOptions = {
      apiKey,
      ...opts,
      baseURL,
      environment: opts.environment ?? 'production',
    };

    if (baseURL && opts.environment) {
      throw new Errors.MixedbreadError(
        'Ambiguous URL; The `baseURL` option (or MIXEDBREAD_BASE_URL env var) and the `environment` option are given. If you want to use the environment you must pass baseURL: null',
      );
    }

    super({
      baseURL: options.baseURL || environments[options.environment || 'production'],
      timeout: options.timeout ?? 60000 /* 1 minute */,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch,
    });

    this._options = options;

    this.apiKey = apiKey;
  }

  serviceInfo: API.ServiceInfo = new API.ServiceInfo(this);
  files: API.Files = new API.Files(this);
  completions: API.Completions = new API.Completions(this);
  vectorStores: API.VectorStores = new API.VectorStores(this);
  parsing: API.Parsing = new API.Parsing(this);
  extractions: API.Extractions = new API.Extractions(this);
  embeddings: API.Embeddings = new API.Embeddings(this);
  reranking: API.Reranking = new API.Reranking(this);

  protected override defaultQuery(): Core.DefaultQuery | undefined {
    return this._options.defaultQuery;
  }

  protected override defaultHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return {
      ...super.defaultHeaders(opts),
      ...this._options.defaultHeaders,
    };
  }

  protected override authHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  static Mixedbread = this;
  static DEFAULT_TIMEOUT = 60000; // 1 minute

  static MixedbreadError = Errors.MixedbreadError;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;
  static fileFromPath = Uploads.fileFromPath;
}

Mixedbread.ServiceInfo = ServiceInfo;
Mixedbread.Files = Files;
Mixedbread.Completions = Completions;
Mixedbread.VectorStores = VectorStores;
Mixedbread.Parsing = Parsing;
Mixedbread.Extractions = Extractions;
Mixedbread.Embeddings = Embeddings;
Mixedbread.Reranking = Reranking;
export declare namespace Mixedbread {
  export type RequestOptions = Core.RequestOptions;

  export { ServiceInfo as ServiceInfo, type InfoResponse as InfoResponse };

  export {
    Files as Files,
    type FileDeleted as FileDeleted,
    type FileObject as FileObject,
    type FileListResponse as FileListResponse,
    type FileCreateParams as FileCreateParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
  };

  export { Completions as Completions, type CompletionCreateResponse as CompletionCreateResponse };

  export {
    VectorStores as VectorStores,
    type SearchFilter as SearchFilter,
    type SearchFilterCondition as SearchFilterCondition,
    type VectorStore as VectorStore,
    type VectorStoreDeleted as VectorStoreDeleted,
    type VectorStoreListResponse as VectorStoreListResponse,
    type VectorStoreQuestionAnsweringResponse as VectorStoreQuestionAnsweringResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreQuestionAnsweringParams as VectorStoreQuestionAnsweringParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export { Parsing as Parsing };

  export { Extractions as Extractions };

  export {
    Embeddings as Embeddings,
    type EmbeddingCreateResponse as EmbeddingCreateResponse,
    type EmbeddingCreateParams as EmbeddingCreateParams,
  };

  export {
    Reranking as Reranking,
    type RerankingCreateResponse as RerankingCreateResponse,
    type RerankingCreateParams as RerankingCreateParams,
  };
}

export { toFile, fileFromPath } from './uploads';
export {
  MixedbreadError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from './error';

export default Mixedbread;
