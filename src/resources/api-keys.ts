// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class APIKeys extends APIResource {
  /**
   * Create a new API key.
   *
   * Args: params: The parameters for creating the API key.
   *
   * Returns: ApiKeyCreated: The response containing the details of the created API
   * key.
   */
  create(body: APIKeyCreateParams, options?: RequestOptions): APIPromise<APIKeyCreated> {
    return this._client.post('/v1/api-keys', { body, ...options });
  }

  /**
   * Retrieve details of a specific API key by its ID.
   *
   * Args: api_key_id: The ID of the API key to retrieve.
   *
   * Returns: ApiKey: The response containing the API key details.
   */
  retrieve(apiKeyID: string, options?: RequestOptions): APIPromise<APIKey> {
    return this._client.get(path`/v1/api-keys/${apiKeyID}`, options);
  }

  /**
   * List all API keys for the authenticated user.
   *
   * Args: pagination: The pagination options
   *
   * Returns: A list of API keys belonging to the user.
   */
  list(
    query: APIKeyListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<APIKeysLimitOffset, APIKey> {
    return this._client.getAPIList('/v1/api-keys', LimitOffset<APIKey>, { query, ...options });
  }

  /**
   * Delete a specific API key by its ID.
   *
   * Args: api_key_id: The ID of the API key to delete.
   *
   * Returns: ApiKeyDeleted: The response containing the details of the deleted API
   * key.
   */
  delete(apiKeyID: string, options?: RequestOptions): APIPromise<APIKeyDeleteResponse> {
    return this._client.delete(path`/v1/api-keys/${apiKeyID}`, options);
  }

  /**
   * Reroll the secret for a specific API key by its ID.
   *
   * This generates a new secret key, invalidating the old one.
   *
   * Args: api_key_id: The ID of the API key to reroll.
   *
   * Returns: ApiKeyCreated: The response containing the API key details with the new
   * secret key.
   */
  reroll(apiKeyID: string, options?: RequestOptions): APIPromise<APIKeyCreated> {
    return this._client.post(path`/v1/api-keys/${apiKeyID}/reroll`, options);
  }

  /**
   * Revoke a specific API key by its ID.
   *
   * Args: api_key_id: The ID of the API key to revoke.
   *
   * Returns: ApiKey: The response containing the details of the revoked API key.
   */
  revoke(apiKeyID: string, options?: RequestOptions): APIPromise<APIKey> {
    return this._client.post(path`/v1/api-keys/${apiKeyID}/revoke`, options);
  }
}

export type APIKeysLimitOffset = LimitOffset<APIKey>;

/**
 * Response model for an API key.
 */
export interface APIKey {
  /**
   * The ID of the API key
   */
  id: string;

  /**
   * The name of the API key
   */
  name: string;

  /**
   * The redacted value of the API key
   */
  redacted_value: string;

  /**
   * The expiration datetime of the API key
   */
  expires_at?: string | null;

  /**
   * The creation datetime of the API key
   */
  created_at: string;

  /**
   * The last update datetime of the API key
   */
  updated_at: string;

  /**
   * The last active datetime of the API key
   */
  last_active_at?: string | null;

  /**
   * The type of the object
   */
  object?: 'api_key';

  /**
   * The scope of the API key
   */
  scope?: Array<APIKey.Scope> | null;
}

export namespace APIKey {
  export interface Scope {
    method: 'read' | 'write' | 'delete' | 'list' | 'create' | 'search';

    resource_type?: 'store' | null;

    resource_id?: string | null;
  }
}

/**
 * Response model for creating an API key.
 */
export interface APIKeyCreated {
  /**
   * The ID of the API key
   */
  id: string;

  /**
   * The name of the API key
   */
  name: string;

  /**
   * The redacted value of the API key
   */
  redacted_value: string;

  /**
   * The expiration datetime of the API key
   */
  expires_at?: string | null;

  /**
   * The creation datetime of the API key
   */
  created_at: string;

  /**
   * The last update datetime of the API key
   */
  updated_at: string;

  /**
   * The last active datetime of the API key
   */
  last_active_at?: string | null;

  /**
   * The type of the object
   */
  object?: 'api_key';

  /**
   * The scope of the API key
   */
  scope?: Array<APIKeyCreated.Scope> | null;

  /**
   * The value of the API key
   */
  value: string;
}

export namespace APIKeyCreated {
  export interface Scope {
    method: 'read' | 'write' | 'delete' | 'list' | 'create' | 'search';

    resource_type?: 'store' | null;

    resource_id?: string | null;
  }
}

/**
 * Response model for deleting an API key.
 */
export interface APIKeyDeleteResponse {
  /**
   * The ID of the deleted API key
   */
  id: string;

  /**
   * Whether the API key was deleted
   */
  deleted: boolean;

  /**
   * The type of the object deleted
   */
  object?: 'api_key';
}

export interface APIKeyCreateParams {
  /**
   * A name/description for the API key
   */
  name?: string;

  /**
   * The scope of the API key
   */
  scope?: Array<APIKeyCreateParams.Scope> | null;

  /**
   * Optional expiration datetime
   */
  expires_at?: string | null;
}

export namespace APIKeyCreateParams {
  export interface Scope {
    method: 'read' | 'write' | 'delete' | 'list' | 'create' | 'search';

    resource_type?: 'store' | null;

    resource_id?: string | null;
  }
}

export interface APIKeyListParams extends LimitOffsetParams {}

export declare namespace APIKeys {
  export {
    type APIKey as APIKey,
    type APIKeyCreated as APIKeyCreated,
    type APIKeyDeleteResponse as APIKeyDeleteResponse,
    type APIKeysLimitOffset as APIKeysLimitOffset,
    type APIKeyCreateParams as APIKeyCreateParams,
    type APIKeyListParams as APIKeyListParams,
  };
}
