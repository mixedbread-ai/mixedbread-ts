// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Connectors extends APIResource {
  /**
   * Create a new connector.
   *
   * Args: data_source_id: The ID of the data source to create a connector for.
   * params: The connector to create.
   *
   * Returns: The created connector.
   */
  create(
    dataSourceID: string,
    body: ConnectorCreateParams,
    options?: RequestOptions,
  ): APIPromise<DataSourceConnector> {
    return this._client.post(path`/v1/data_sources/${dataSourceID}/connectors`, { body, ...options });
  }

  /**
   * Get a connector by ID.
   *
   * Args: data_source_id: The ID of the data source to get a connector for.
   * connector_id: The ID of the connector to get.
   *
   * Returns: The connector.
   */
  retrieve(
    connectorID: string,
    params: ConnectorRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<DataSourceConnector> {
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
   */
  update(
    connectorID: string,
    params: ConnectorUpdateParams,
    options?: RequestOptions,
  ): APIPromise<DataSourceConnector> {
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
   */
  list(
    dataSourceID: string,
    query: ConnectorListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ConnectorListResponse> {
    return this._client.get(path`/v1/data_sources/${dataSourceID}/connectors`, { query, ...options });
  }

  /**
   * Delete a connector.
   *
   * Args: data_source_id: The ID of the data source to delete a connector for.
   * connector_id: The ID of the connector to delete.
   *
   * Returns: The deleted connector.
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
  error: { [key: string]: unknown } | null;

  /**
   * The type of the object
   */
  object?: 'data_source.connector';
}

/**
 * A list of connectors with pagination.
 */
export interface ConnectorListResponse {
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
  pagination: ConnectorListResponse.Pagination;

  /**
   * The list of connectors
   */
  data: Array<DataSourceConnector>;

  /**
   * The object type of the response
   */
  object?: 'list';
}

export namespace ConnectorListResponse {
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
 * Deleted connector.
 */
export interface ConnectorDeleteResponse {
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
   * Polling interval for the connector. Defaults to 30 minutes if not specified. Can
   * be provided as:
   *
   * - int: Number of seconds (e.g., 1800 for 30 minutes)
   * - str: Duration string (e.g., '30m', '1h', '2d') or ISO 8601 format (e.g.,
   *   'PT30M', 'P1D') Valid range: 15 seconds to 30 days
   */
  polling_interval?: number | string | null;
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
  metadata?: { [key: string]: unknown } | null;

  /**
   * Body param: Whether the connector should be synced after update
   */
  trigger_sync?: boolean | null;

  /**
   * Body param: Polling interval for the connector. Defaults to 30 minutes if not
   * specified. Can be provided as:
   *
   * - int: Number of seconds (e.g., 1800 for 30 minutes)
   * - str: Duration string (e.g., '30m', '1h', '2d') or ISO 8601 format (e.g.,
   *   'PT30M', 'P1D') Valid range: 15 seconds to 30 days
   */
  polling_interval?: number | string | null;
}

export interface ConnectorListParams {
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

export interface ConnectorDeleteParams {
  /**
   * The ID of the data source to delete a connector for
   */
  data_source_id: string;
}

export declare namespace Connectors {
  export {
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
