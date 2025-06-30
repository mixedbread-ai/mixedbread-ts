// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ConnectorsAPI from './connectors';
import {
  ConnectorCreateParams,
  ConnectorDeleteParams,
  ConnectorDeleteResponse,
  ConnectorListParams,
  ConnectorListResponse,
  ConnectorRetrieveParams,
  ConnectorUpdateParams,
  Connectors,
  DataSourceConnector,
} from './connectors';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class DataSources extends APIResource {
  connectors: ConnectorsAPI.Connectors = new ConnectorsAPI.Connectors(this._client);

  /**
   * Create a new data source.
   *
   * Args: params: The data source to create.
   *
   * Returns: The created data source.
   */
  create(body: DataSourceCreateParams, options?: RequestOptions): APIPromise<DataSource> {
    return this._client.post('/v1/data_sources/', { body, ...options });
  }

  /**
   * Get a data source by ID.
   *
   * Args: data_source_id: The ID of the data source to fetch.
   *
   * Returns: The data source.
   */
  retrieve(dataSourceID: string, options?: RequestOptions): APIPromise<DataSource> {
    return this._client.get(path`/v1/data_sources/${dataSourceID}`, options);
  }

  /**
   * Update a data source.
   *
   * Args: data_source_id: The ID of the data source to update. params: The data
   * source to update.
   *
   * Returns: The updated data source.
   */
  update(
    dataSourceID: string,
    body: DataSourceUpdateParams,
    options?: RequestOptions,
  ): APIPromise<DataSource> {
    return this._client.put(path`/v1/data_sources/${dataSourceID}`, { body, ...options });
  }

  /**
   * Get all data sources.
   *
   * Returns: The list of data sources.
   */
  list(
    query: DataSourceListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DataSourceListResponse> {
    return this._client.get('/v1/data_sources/', { query, ...options });
  }

  /**
   * Delete a data source.
   *
   * Args: data_source_id: The ID of the data source to delete.
   */
  delete(dataSourceID: string, options?: RequestOptions): APIPromise<DataSourceDeleteResponse> {
    return this._client.delete(path`/v1/data_sources/${dataSourceID}`, options);
  }
}

/**
 * Service-level representation of a data source.
 */
export interface DataSource {
  /**
   * The ID of the data source
   */
  id: string;

  /**
   * The creation time of the data source
   */
  created_at: string;

  /**
   * The last update time of the data source
   */
  updated_at: string;

  /**
   * The type of data source
   */
  type: DataSourceType;

  /**
   * The name of the data source
   */
  name: string;

  /**
   * The metadata of the data source
   */
  metadata: unknown;

  /**
   * Authentication parameters
   */
  auth_params: DataSourceOauth2Params | DataSource.DataSourceAPIKeyParams | null;

  /**
   * The type of the object
   */
  object?: 'data_source';
}

export namespace DataSource {
  /**
   * Authentication parameters for a API key data source.
   */
  export interface DataSourceAPIKeyParams {
    type?: 'api_key';

    /**
     * The API key
     */
    api_key: string;
  }
}

/**
 * Authentication parameters for a OAuth data source.
 */
export interface DataSourceOauth2Params {
  type?: 'oauth2';

  /**
   * The timestamp when the OAuth2 credentials were created
   */
  created_at?: string;

  /**
   * The OAuth2 scope
   */
  scope?: string;

  /**
   * The OAuth2 access token
   */
  access_token?: string | null;

  /**
   * The OAuth2 refresh token
   */
  refresh_token?: string | null;

  /**
   * The OAuth2 token type
   */
  token_type?: string | null;

  /**
   * The OAuth2 token expiration timestamp
   */
  expires_on?: string | null;

  /**
   * Additional parameters for the OAuth2 flow
   */
  additional_params?: { [key: string]: unknown } | null;
}

export type DataSourceType = 'notion' | 'linear';

/**
 * Parameters for creating or updating a Linear data source.
 */
export interface LinearDataSource {
  /**
   * The type of data source to create
   */
  type?: DataSourceType;

  /**
   * The name of the data source
   */
  name: string;

  /**
   * The metadata of the data source
   */
  metadata?: unknown;

  /**
   * Base class for OAuth2 create or update parameters.
   */
  auth_params?: Oauth2Params | null;
}

/**
 * Parameters for creating or updating a Notion data source.
 */
export interface NotionDataSource {
  /**
   * The type of data source to create
   */
  type?: DataSourceType;

  /**
   * The name of the data source
   */
  name: string;

  /**
   * The metadata of the data source
   */
  metadata?: unknown;

  /**
   * The authentication parameters of the data source. Notion supports OAuth2 and API
   * key.
   */
  auth_params?: Oauth2Params | NotionDataSource.APIKeyCreateOrUpdateParams | null;
}

export namespace NotionDataSource {
  /**
   * Base class for API key create or update parameters.
   */
  export interface APIKeyCreateOrUpdateParams {
    type?: 'api_key';

    /**
     * The API key
     */
    api_key: string;
  }
}

/**
 * Base class for OAuth2 create or update parameters.
 */
export interface Oauth2Params {
  type?: 'oauth2';
}

/**
 * A list of data sources with pagination.
 */
export interface DataSourceListResponse {
  /**
   * Response model for cursor-based pagination.
   *
   * Examples: Forward pagination response: { "has_more": true, "first_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMSIsImlkIjoiYWJjMTIzIn0=", "last_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMCIsImlkIjoieHl6Nzg5In0=", "total": null }
   *
   *     Final page response:
   *         {
   *             "has_more": false,
   *             "first_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOSIsImlkIjoibGFzdDEyMyJ9",
   *             "last_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOCIsImlkIjoiZmluYWw0NTYifQ==",
   *             "total": 42
   *         }
   *
   *     Empty results:
   *         {
   *             "has_more": false,
   *             "first_cursor": null,
   *             "last_cursor": null,
   *             "total": 0
   *         }
   */
  pagination: DataSourceListResponse.Pagination;

  /**
   * The list of data sources
   */
  data: Array<DataSource>;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace DataSourceListResponse {
  /**
   * Response model for cursor-based pagination.
   *
   * Examples: Forward pagination response: { "has_more": true, "first_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMSIsImlkIjoiYWJjMTIzIn0=", "last_cursor":
   * "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMCIsImlkIjoieHl6Nzg5In0=", "total": null }
   *
   *     Final page response:
   *         {
   *             "has_more": false,
   *             "first_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOSIsImlkIjoibGFzdDEyMyJ9",
   *             "last_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0yOCIsImlkIjoiZmluYWw0NTYifQ==",
   *             "total": 42
   *         }
   *
   *     Empty results:
   *         {
   *             "has_more": false,
   *             "first_cursor": null,
   *             "last_cursor": null,
   *             "total": 0
   *         }
   */
  export interface Pagination {
    /**
     * Contextual direction-aware flag: True if more items exist in the requested
     * pagination direction. For 'after': more items after this page. For 'before':
     * more items before this page.
     */
    has_more: boolean;

    /**
     * Cursor of the first item in this page. Use for backward pagination. None if page
     * is empty.
     */
    first_cursor: string | null;

    /**
     * Cursor of the last item in this page. Use for forward pagination. None if page
     * is empty.
     */
    last_cursor: string | null;

    /**
     * Total number of items available across all pages. Only included when
     * include_total=true was requested. Expensive operation - use sparingly.
     */
    total?: number | null;
  }
}

/**
 * Deleted data source.
 */
export interface DataSourceDeleteResponse {
  /**
   * The ID of the data source
   */
  id: string;

  /**
   * Whether the data source was deleted
   */
  deleted?: boolean;

  /**
   * The type of the object
   */
  object?: 'data_source';
}

export type DataSourceCreateParams =
  | DataSourceCreateParams.NotionDataSource
  | DataSourceCreateParams.LinearDataSource;

export declare namespace DataSourceCreateParams {
  export interface NotionDataSource {
    /**
     * The type of data source to create
     */
    type?: DataSourceType;

    /**
     * The name of the data source
     */
    name: string;

    /**
     * The metadata of the data source
     */
    metadata?: unknown;

    /**
     * The authentication parameters of the data source. Notion supports OAuth2 and API
     * key.
     */
    auth_params?: Oauth2Params | NotionDataSource.APIKeyCreateOrUpdateParams | null;
  }

  export namespace NotionDataSource {
    /**
     * Base class for API key create or update parameters.
     */
    export interface APIKeyCreateOrUpdateParams {
      type?: 'api_key';

      /**
       * The API key
       */
      api_key: string;
    }
  }

  export interface LinearDataSource {
    /**
     * The type of data source to create
     */
    type?: DataSourceType;

    /**
     * The name of the data source
     */
    name: string;

    /**
     * The metadata of the data source
     */
    metadata?: unknown;

    /**
     * Base class for OAuth2 create or update parameters.
     */
    auth_params?: Oauth2Params | null;
  }
}

export type DataSourceUpdateParams =
  | DataSourceUpdateParams.NotionDataSource
  | DataSourceUpdateParams.LinearDataSource;

export declare namespace DataSourceUpdateParams {
  export interface NotionDataSource {
    /**
     * The type of data source to create
     */
    type?: DataSourceType;

    /**
     * The name of the data source
     */
    name: string;

    /**
     * The metadata of the data source
     */
    metadata?: unknown;

    /**
     * The authentication parameters of the data source. Notion supports OAuth2 and API
     * key.
     */
    auth_params?: Oauth2Params | NotionDataSource.APIKeyCreateOrUpdateParams | null;
  }

  export namespace NotionDataSource {
    /**
     * Base class for API key create or update parameters.
     */
    export interface APIKeyCreateOrUpdateParams {
      type?: 'api_key';

      /**
       * The API key
       */
      api_key: string;
    }
  }

  export interface LinearDataSource {
    /**
     * The type of data source to create
     */
    type?: DataSourceType;

    /**
     * The name of the data source
     */
    name: string;

    /**
     * The metadata of the data source
     */
    metadata?: unknown;

    /**
     * Base class for OAuth2 create or update parameters.
     */
    auth_params?: Oauth2Params | null;
  }
}

export interface DataSourceListParams {
  /**
   * Maximum number of items to return per page (1-100)
   */
  limit?: number;

  /**
   * Cursor for forward pagination - get items after this position. Use last_cursor
   * from previous response.
   */
  after?: string | null;

  /**
   * Cursor for backward pagination - get items before this position. Use
   * first_cursor from previous response.
   */
  before?: string | null;

  /**
   * Whether to include total count in response (expensive operation)
   */
  include_total?: boolean;
}

DataSources.Connectors = Connectors;

export declare namespace DataSources {
  export {
    type DataSource as DataSource,
    type DataSourceOauth2Params as DataSourceOauth2Params,
    type DataSourceType as DataSourceType,
    type LinearDataSource as LinearDataSource,
    type NotionDataSource as NotionDataSource,
    type Oauth2Params as Oauth2Params,
    type DataSourceListResponse as DataSourceListResponse,
    type DataSourceDeleteResponse as DataSourceDeleteResponse,
    type DataSourceCreateParams as DataSourceCreateParams,
    type DataSourceUpdateParams as DataSourceUpdateParams,
    type DataSourceListParams as DataSourceListParams,
  };

  export {
    Connectors as Connectors,
    type DataSourceConnector as DataSourceConnector,
    type ConnectorListResponse as ConnectorListResponse,
    type ConnectorDeleteResponse as ConnectorDeleteResponse,
    type ConnectorCreateParams as ConnectorCreateParams,
    type ConnectorRetrieveParams as ConnectorRetrieveParams,
    type ConnectorUpdateParams as ConnectorUpdateParams,
    type ConnectorListParams as ConnectorListParams,
    type ConnectorDeleteParams as ConnectorDeleteParams,
  };
}
