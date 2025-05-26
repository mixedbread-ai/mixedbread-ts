// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ConnectorsAPI from './connectors';
import {
  ConnectorCreateParams,
  ConnectorDeleteParams,
  ConnectorDeleteResponse,
  ConnectorListParams,
  ConnectorRetrieveParams,
  ConnectorUpdateParams,
  Connectors,
  DataSourceConnector,
  DataSourceConnectorsLimitOffset,
} from './connectors';
import { APIPromise } from '../../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../../core/pagination';
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
  ): PagePromise<DataSourcesLimitOffset, DataSource> {
    return this._client.getAPIList('/v1/data_sources/', LimitOffset<DataSource>, { query, ...options });
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

export type DataSourcesLimitOffset = LimitOffset<DataSource>;

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
   * Authentication parameters for a OAuth data source.
   */
  auth_params: DataSourceOauth2Params | null;

  /**
   * The type of the object
   */
  object?: 'data_source';
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
   * The OAuth2 client ID
   */
  client_id: string;

  /**
   * The OAuth2 client secret
   */
  client_secret: string;

  /**
   * The OAuth2 redirect URI
   */
  redirect_uri: string;

  /**
   * The OAuth2 scope
   */
  scope: string;

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
}

export type DataSourceType = 'notion' | 'linear';

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

export interface DataSourceCreateParams {
  /**
   * The type of data source to create
   */
  type: DataSourceType;

  /**
   * The name of the data source
   */
  name: string;

  /**
   * The metadata of the data source
   */
  metadata?: unknown;

  /**
   * Authentication parameters for a OAuth data source.
   */
  auth_params?: DataSourceOauth2Params | null;
}

export interface DataSourceUpdateParams {
  /**
   * The name of the data source
   */
  name?: string | null;

  /**
   * The metadata of the data source
   */
  metadata?: unknown;

  /**
   * Authentication parameters for a OAuth data source.
   */
  auth_params?: DataSourceOauth2Params | null;
}

export interface DataSourceListParams extends LimitOffsetParams {}

DataSources.Connectors = Connectors;

export declare namespace DataSources {
  export {
    type DataSource as DataSource,
    type DataSourceOauth2Params as DataSourceOauth2Params,
    type DataSourceType as DataSourceType,
    type DataSourceDeleteResponse as DataSourceDeleteResponse,
    type DataSourcesLimitOffset as DataSourcesLimitOffset,
    type DataSourceCreateParams as DataSourceCreateParams,
    type DataSourceUpdateParams as DataSourceUpdateParams,
    type DataSourceListParams as DataSourceListParams,
  };

  export {
    Connectors as Connectors,
    type DataSourceConnector as DataSourceConnector,
    type ConnectorDeleteResponse as ConnectorDeleteResponse,
    type DataSourceConnectorsLimitOffset as DataSourceConnectorsLimitOffset,
    type ConnectorCreateParams as ConnectorCreateParams,
    type ConnectorRetrieveParams as ConnectorRetrieveParams,
    type ConnectorUpdateParams as ConnectorUpdateParams,
    type ConnectorListParams as ConnectorListParams,
    type ConnectorDeleteParams as ConnectorDeleteParams,
  };
}
