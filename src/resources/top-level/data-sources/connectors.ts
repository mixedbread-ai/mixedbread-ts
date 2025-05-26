// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { LimitOffset, type LimitOffsetParams, PagePromise } from '../../../core/pagination';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Connectors extends APIResource {
  /**
   * Create a new connector.
   *
   * Args: data_source_id: The ID of the data source to create a connector for.
   * params: The connector to create.
   *
   * Returns: The created connector.
   *
   * @example
   * ```ts
   * const connector =
   *   await client.client.dataSources.connectors.create(
   *     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     { vector_store_id: 'vector_store_id' },
   *   );
   * ```
   */
  create(
    dataSourceID: string,
    body: ConnectorCreateParams,
    options?: RequestOptions,
  ): APIPromise<ConnectorCreateResponse> {
    return this._client.post(path`/v1/data_sources/${dataSourceID}/connectors`, { body, ...options });
  }

  /**
   * Get a connector by ID.
   *
   * Args: data_source_id: The ID of the data source to get a connector for.
   * connector_id: The ID of the connector to get.
   *
   * Returns: The connector.
   *
   * @example
   * ```ts
   * const connector =
   *   await client.client.dataSources.connectors.retrieve(
   *     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     {
   *       data_source_id:
   *         '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     },
   *   );
   * ```
   */
  retrieve(
    connectorID: string,
    params: ConnectorRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<ConnectorRetrieveResponse> {
    const { data_source_id } = params;
    return this._client.get(path`/v1/data_sources/${data_source_id}/connectors/${connectorID}`, options);
  }

  /**
   * Update a connector.
   *
   * Args: data_source_id: The ID of the data source to update a connector for.
   * connector_id: The ID of the connector to update. params: The connector to
   * update.
   *
   * Returns: The updated connector.
   *
   * @example
   * ```ts
   * const connector =
   *   await client.client.dataSources.connectors.update(
   *     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     {
   *       data_source_id:
   *         '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     },
   *   );
   * ```
   */
  update(
    connectorID: string,
    params: ConnectorUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ConnectorUpdateResponse> {
    const { data_source_id, ...body } = params;
    return this._client.put(path`/v1/data_sources/${data_source_id}/connectors/${connectorID}`, {
      body,
      ...options,
    });
  }

  /**
   * Get all connectors for a data source.
   *
   * Args: data_source_id: The ID of the data source to get connectors for.
   * pagination: The pagination options.
   *
   * Returns: The list of connectors.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const connectorListResponse of client.client.dataSources.connectors.list(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(
    dataSourceID: string,
    query: ConnectorListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<ConnectorListResponsesLimitOffset, ConnectorListResponse> {
    return this._client.getAPIList(
      path`/v1/data_sources/${dataSourceID}/connectors`,
      LimitOffset<ConnectorListResponse>,
      { query, ...options },
    );
  }

  /**
   * Delete a connector.
   *
   * Args: data_source_id: The ID of the data source to delete a connector for.
   * connector_id: The ID of the connector to delete.
   *
   * Returns: The deleted connector.
   *
   * @example
   * ```ts
   * const connector =
   *   await client.client.dataSources.connectors.delete(
   *     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     {
   *       data_source_id:
   *         '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *     },
   *   );
   * ```
   */
  delete(
    connectorID: string,
    params: ConnectorDeleteParams,
    options?: RequestOptions,
  ): APIPromise<ConnectorDeleteResponse> {
    const { data_source_id } = params;
    return this._client.delete(path`/v1/data_sources/${data_source_id}/connectors/${connectorID}`, options);
  }
}

export type ConnectorListResponsesLimitOffset = LimitOffset<ConnectorListResponse>;

/**
 * Service-level representation of a connector.
 */
export interface DataSourceConnector {
  /**
   * The ID of the connector
   */
  id: string;

  /**
   * The creation time of the connector
   */
  created_at: string;

  /**
   * The last update time of the connector
   */
  updated_at: string;

  /**
   * The ID of the vector store
   */
  vector_store_id: string;

  /**
   * The ID of the data source
   */
  data_source_id: string;

  /**
   * The name of the connector
   */
  name?: string;

  /**
   * The metadata of the connector
   */
  metadata: unknown;

  /**
   * The polling interval of the connector
   */
  polling_interval: string;

  /**
   * The start time of the connector
   */
  started_at: string | null;

  /**
   * The finish time of the connector
   */
  finished_at: string | null;

  /**
   * The last sync time of the connector
   */
  last_synced_at: string | null;

  /**
   * The sync status of the connector
   */
  status: 'idle' | 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The sync error of the connector
   */
  error: string | null;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

/**
 * Service-level representation of a connector.
 */
export interface DataSourceConnector {
  /**
   * The ID of the connector
   */
  id: string;

  /**
   * The creation time of the connector
   */
  created_at: string;

  /**
   * The last update time of the connector
   */
  updated_at: string;

  /**
   * The ID of the vector store
   */
  vector_store_id: string;

  /**
   * The ID of the data source
   */
  data_source_id: string;

  /**
   * The name of the connector
   */
  name?: string;

  /**
   * The metadata of the connector
   */
  metadata: unknown;

  /**
   * The polling interval of the connector
   */
  polling_interval: string;

  /**
   * The start time of the connector
   */
  started_at: string | null;

  /**
   * The finish time of the connector
   */
  finished_at: string | null;

  /**
   * The last sync time of the connector
   */
  last_synced_at: string | null;

  /**
   * The sync status of the connector
   */
  status: 'idle' | 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The sync error of the connector
   */
  error: string | null;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

/**
 * Service-level representation of a connector.
 */
export interface DataSourceConnector {
  /**
   * The ID of the connector
   */
  id: string;

  /**
   * The creation time of the connector
   */
  created_at: string;

  /**
   * The last update time of the connector
   */
  updated_at: string;

  /**
   * The ID of the vector store
   */
  vector_store_id: string;

  /**
   * The ID of the data source
   */
  data_source_id: string;

  /**
   * The name of the connector
   */
  name?: string;

  /**
   * The metadata of the connector
   */
  metadata: unknown;

  /**
   * The polling interval of the connector
   */
  polling_interval: string;

  /**
   * The start time of the connector
   */
  started_at: string | null;

  /**
   * The finish time of the connector
   */
  finished_at: string | null;

  /**
   * The last sync time of the connector
   */
  last_synced_at: string | null;

  /**
   * The sync status of the connector
   */
  status: 'idle' | 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The sync error of the connector
   */
  error: string | null;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

/**
 * Service-level representation of a connector.
 */
export interface DataSourceConnector {
  /**
   * The ID of the connector
   */
  id: string;

  /**
   * The creation time of the connector
   */
  created_at: string;

  /**
   * The last update time of the connector
   */
  updated_at: string;

  /**
   * The ID of the vector store
   */
  vector_store_id: string;

  /**
   * The ID of the data source
   */
  data_source_id: string;

  /**
   * The name of the connector
   */
  name?: string;

  /**
   * The metadata of the connector
   */
  metadata: unknown;

  /**
   * The polling interval of the connector
   */
  polling_interval: string;

  /**
   * The start time of the connector
   */
  started_at: string | null;

  /**
   * The finish time of the connector
   */
  finished_at: string | null;

  /**
   * The last sync time of the connector
   */
  last_synced_at: string | null;

  /**
   * The sync status of the connector
   */
  status: 'idle' | 'pending' | 'in_progress' | 'cancelled' | 'completed' | 'failed';

  /**
   * The sync error of the connector
   */
  error: string | null;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

/**
 * Deleted connector.
 */
export interface DataSourceConnectorDeleted {
  /**
   * The ID of the connector
   */
  id: string;

  /**
   * Whether the connector was deleted
   */
  deleted?: boolean;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

export interface ConnectorCreateParams {
  /**
   * The ID of the vector store
   */
  vector_store_id: string;

  /**
   * The name of the connector
   */
  name?: string;

  /**
   * Whether the connector should be synced after creation
   */
  trigger_sync?: boolean;

  /**
   * The metadata of the connector
   */
  metadata?: unknown;

  /**
   * The polling interval of the connector
   */
  polling_interval?: string | null;
}

export interface ConnectorRetrieveParams {
  /**
   * The ID of the data source to get a connector for
   */
  data_source_id: string;
}

export interface ConnectorUpdateParams {
  /**
   * Path param: The ID of the data source to update a connector for
   */
  data_source_id: string;

  /**
   * Body param: The name of the connector
   */
  name?: string | null;

  /**
   * Body param: The metadata of the connector
   */
  metadata?: Record<string, unknown> | null;

  /**
   * Body param: Whether the connector should be synced after update
   */
  trigger_sync?: boolean | null;

  /**
   * Body param: The polling interval of the connector
   */
  polling_interval?: string | null;
}

export interface ConnectorListParams extends LimitOffsetParams {}

export interface ConnectorDeleteParams {
  /**
   * The ID of the data source to delete a connector for
   */
  data_source_id: string;
}

export declare namespace Connectors {
  export {
    type ConnectorCreateResponse as ConnectorCreateResponse,
    type ConnectorRetrieveResponse as ConnectorRetrieveResponse,
    type ConnectorUpdateResponse as ConnectorUpdateResponse,
    type ConnectorListResponse as ConnectorListResponse,
    type ConnectorDeleteResponse as ConnectorDeleteResponse,
    type ConnectorListResponsesLimitOffset as ConnectorListResponsesLimitOffset,
    type ConnectorCreateParams as ConnectorCreateParams,
    type ConnectorRetrieveParams as ConnectorRetrieveParams,
    type ConnectorUpdateParams as ConnectorUpdateParams,
    type ConnectorListParams as ConnectorListParams,
    type ConnectorDeleteParams as ConnectorDeleteParams,
  };
}
