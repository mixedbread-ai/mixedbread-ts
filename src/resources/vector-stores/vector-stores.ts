// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as FilesAPI from './files';
import {
  FileCreateParams,
  FileCreateResponse,
  FileDeleteResponse,
  FileListParams,
  FileListResponse,
  FileRetrieveResponse,
  Files,
} from './files';

export class VectorStores extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);

  /**
   * Create a new vector store.
   *
   * Args: vector_store_create: VectorStoreCreate object containing the name,
   * description, and metadata.
   *
   * Returns: VectorStore: The response containing the created vector store details.
   */
  create(
    body: VectorStoreCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreCreateResponse> {
    return this._client.post('/v1/vector_stores', { body, ...options });
  }

  /**
   * Get a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to retrieve.
   *
   * Returns: VectorStore: The response containing the vector store details.
   */
  retrieve(
    vectorStoreId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreRetrieveResponse> {
    return this._client.get(`/v1/vector_stores/${vectorStoreId}`, options);
  }

  /**
   * Update a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to update.
   * vector_store_create: VectorStoreCreate object containing the name, description,
   * and metadata.
   *
   * Returns: VectorStore: The response containing the updated vector store details.
   */
  update(
    vectorStoreId: string,
    body: VectorStoreUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreUpdateResponse> {
    return this._client.put(`/v1/vector_stores/${vectorStoreId}`, { body, ...options });
  }

  /**
   * List all vector stores.
   *
   * Args: pagination: The pagination options.
   *
   * Returns: list[VectorStore]: The list of vector stores.
   */
  list(
    query?: VectorStoreListParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreListResponse>;
  list(options?: Core.RequestOptions): Core.APIPromise<VectorStoreListResponse>;
  list(
    query: VectorStoreListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreListResponse> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/v1/vector_stores', { query, ...options });
  }

  /**
   * Delete a vector store by ID.
   *
   * Args: vector_store_id: The ID of the vector store to delete.
   *
   * Returns: VectorStore: The response containing the deleted vector store details.
   */
  delete(vectorStoreId: string, options?: Core.RequestOptions): Core.APIPromise<VectorStoreDeleteResponse> {
    return this._client.delete(`/v1/vector_stores/${vectorStoreId}`, options);
  }

  /**
   * Perform a search based on the provided query.
   *
   * Args: search_query: SearchQuery object containing the search parameters.
   *
   * Returns: SearchResponse: The response containing the search results and
   * pagination details.
   */
  search(
    body: VectorStoreSearchParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<VectorStoreSearchResponse> {
    return this._client.post('/v1/vector_stores/search', { body, ...options });
  }
}

export interface VectorStoreCreateResponse {
  id: string;

  /**
   * Timestamp of vector store creation
   */
  created_at: string;

  description: string | null;

  /**
   * Timestamp of vector store expiration
   */
  expires_at: string | null;

  name: string;

  /**
   * The status of the vector store
   */
  status: 'expired' | 'active';

  file_counts?: VectorStoreCreateResponse.FileCounts;

  /**
   * Set of key-value pairs that can be attached to an object.
   */
  metadata?: unknown | null;

  usage_bytes?: number;
}

export namespace VectorStoreCreateResponse {
  export interface FileCounts {
    canceled?: number;

    failed?: number;

    in_progress?: number;

    successful?: number;

    total?: number;
  }
}

export interface VectorStoreRetrieveResponse {
  id: string;

  /**
   * Timestamp of vector store creation
   */
  created_at: string;

  description: string | null;

  /**
   * Timestamp of vector store expiration
   */
  expires_at: string | null;

  name: string;

  /**
   * The status of the vector store
   */
  status: 'expired' | 'active';

  file_counts?: VectorStoreRetrieveResponse.FileCounts;

  /**
   * Set of key-value pairs that can be attached to an object.
   */
  metadata?: unknown | null;

  usage_bytes?: number;
}

export namespace VectorStoreRetrieveResponse {
  export interface FileCounts {
    canceled?: number;

    failed?: number;

    in_progress?: number;

    successful?: number;

    total?: number;
  }
}

export interface VectorStoreUpdateResponse {
  id: string;

  /**
   * Timestamp of vector store creation
   */
  created_at: string;

  description: string | null;

  /**
   * Timestamp of vector store expiration
   */
  expires_at: string | null;

  name: string;

  /**
   * The status of the vector store
   */
  status: 'expired' | 'active';

  file_counts?: VectorStoreUpdateResponse.FileCounts;

  /**
   * Set of key-value pairs that can be attached to an object.
   */
  metadata?: unknown | null;

  usage_bytes?: number;
}

export namespace VectorStoreUpdateResponse {
  export interface FileCounts {
    canceled?: number;

    failed?: number;

    in_progress?: number;

    successful?: number;

    total?: number;
  }
}

export interface VectorStoreListResponse {
  data: Array<VectorStoreListResponse.Data>;

  pagination: VectorStoreListResponse.Pagination;
}

export namespace VectorStoreListResponse {
  export interface Data {
    id: string;

    /**
     * Timestamp of vector store creation
     */
    created_at: string;

    description: string | null;

    /**
     * Timestamp of vector store expiration
     */
    expires_at: string | null;

    name: string;

    /**
     * The status of the vector store
     */
    status: 'expired' | 'active';

    file_counts?: Data.FileCounts;

    /**
     * Set of key-value pairs that can be attached to an object.
     */
    metadata?: unknown | null;

    usage_bytes?: number;
  }

  export namespace Data {
    export interface FileCounts {
      canceled?: number;

      failed?: number;

      in_progress?: number;

      successful?: number;

      total?: number;
    }
  }

  export interface Pagination {
    after?: number;

    limit?: number;

    total?: number;
  }
}

export interface VectorStoreDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface VectorStoreSearchResponse {
  data: Array<Array<VectorStoreSearchResponse.Data>>;

  pagination: VectorStoreSearchResponse.Pagination;
}

export namespace VectorStoreSearchResponse {
  export interface Data {
    id: string;

    /**
     * Timestamp of vector store file creation
     */
    created_at: string;

    vector_store_id: string;

    errors?: Array<string> | null;

    metadata?: unknown | null;

    status?: 'none' | 'running' | 'canceled' | 'successful' | 'failed' | 'resumable' | 'pending';

    usage_bytes?: number | null;

    version?: number | null;
  }

  export interface Pagination {
    after?: number;

    limit?: number;

    total?: number;
  }
}

export interface VectorStoreCreateParams {
  description?: string | null;

  expires_at?: string | null;

  metadata?: unknown | null;

  name?: string | null;
}

export interface VectorStoreUpdateParams {
  description?: string | null;

  expires_at?: string | null;

  metadata?: unknown | null;

  name?: string | null;
}

export interface VectorStoreListParams {
  after?: number;

  limit?: number;
}

export interface VectorStoreSearchParams {
  query: string;

  vector_store_ids: Array<string>;

  after?: number;

  /**
   * List of conditions or filters to be ANDed together
   */
  filter?:
    | VectorStoreSearchParams.Filter
    | Array<VectorStoreSearchParams.Condition | VectorStoreSearchParams.Filter>
    | null;

  limit?: number;

  options?: VectorStoreSearchParams.Options | null;
}

export namespace VectorStoreSearchParams {
  /**
   * List of conditions or filters to be ANDed together
   */
  export interface Filter {
    /**
     * List of conditions or filters to be ANDed together
     */
    and_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;

    /**
     * List of conditions or filters to be NOTed
     */
    not_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;

    /**
     * List of conditions or filters to be ORed together
     */
    or_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;
  }

  export namespace Filter {
    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      and_?: unknown;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: unknown | Array<Filter.Condition | Filter.Filter>;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: unknown | Array<Filter.Condition | Filter.Filter>;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      and_?: unknown;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: Filter.Filter | Array<Filter.Condition | unknown>;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: Filter.Filter | Array<Filter.Condition | unknown>;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }

    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: unknown | Array<Filter.Condition | Filter.Filter>;

      not_?: unknown;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: unknown | Array<Filter.Condition | Filter.Filter>;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: Filter.Filter | Array<Filter.Condition | unknown>;

      not_?: unknown;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: Filter.Filter | Array<Filter.Condition | unknown>;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }

    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: unknown | Array<Filter.Condition | Filter.Filter>;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: unknown | Array<Filter.Condition | Filter.Filter>;

      or_?: unknown;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: Filter.Filter | Array<Filter.Condition | unknown>;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: Filter.Filter | Array<Filter.Condition | unknown>;

      or_?: unknown;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }
  }

  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface Condition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }

  /**
   * Represents a filter with AND, OR, and NOT conditions.
   */
  export interface Filter {
    /**
     * List of conditions or filters to be ANDed together
     */
    and_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;

    /**
     * List of conditions or filters to be NOTed
     */
    not_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;

    /**
     * List of conditions or filters to be ORed together
     */
    or_?: Filter.Filter | Array<Filter.Condition | Filter.Filter>;
  }

  export namespace Filter {
    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      and_?: unknown;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: unknown | Array<Filter.Condition | Filter.Filter>;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: unknown | Array<Filter.Condition | Filter.Filter>;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      and_?: unknown;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: Filter.Filter | Array<Filter.Condition | unknown>;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: Filter.Filter | Array<Filter.Condition | unknown>;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }

    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: unknown | Array<Filter.Condition | Filter.Filter>;

      not_?: unknown;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: unknown | Array<Filter.Condition | Filter.Filter>;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: Filter.Filter | Array<Filter.Condition | unknown>;

      not_?: unknown;

      /**
       * List of conditions or filters to be ORed together
       */
      or_?: Filter.Filter | Array<Filter.Condition | unknown>;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        not_?: unknown;

        /**
         * List of conditions or filters to be ORed together
         */
        or_?: unknown | Array<Filter.Condition | unknown>;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }

    /**
     * List of conditions or filters to be ANDed together
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: unknown | Array<Filter.Condition | Filter.Filter>;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: unknown | Array<Filter.Condition | Filter.Filter>;

      or_?: unknown;
    }

    export namespace Filter {
      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * Represents a filter with AND, OR, and NOT conditions.
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }
    }

    /**
     * Represents a condition with a field, operator, and value.
     */
    export interface Condition {
      /**
       * The field to apply the condition on
       */
      key: string;

      /**
       * The operator for the condition
       */
      operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

      /**
       * The value to compare against
       */
      value: unknown;
    }

    /**
     * Represents a filter with AND, OR, and NOT conditions.
     */
    export interface Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      and_?: Filter.Filter | Array<Filter.Condition | unknown>;

      /**
       * List of conditions or filters to be NOTed
       */
      not_?: Filter.Filter | Array<Filter.Condition | unknown>;

      or_?: unknown;
    }

    export namespace Filter {
      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        and_?: unknown;

        /**
         * List of conditions or filters to be NOTed
         */
        not_?: unknown | Array<Filter.Condition | unknown>;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }

      /**
       * List of conditions or filters to be ANDed together
       */
      export interface Filter {
        /**
         * List of conditions or filters to be ANDed together
         */
        and_?: unknown | Array<Filter.Condition | unknown>;

        not_?: unknown;

        or_?: unknown;
      }

      export namespace Filter {
        /**
         * Represents a condition with a field, operator, and value.
         */
        export interface Condition {
          /**
           * The field to apply the condition on
           */
          key: string;

          /**
           * The operator for the condition
           */
          operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

          /**
           * The value to compare against
           */
          value: unknown;
        }
      }

      /**
       * Represents a condition with a field, operator, and value.
       */
      export interface Condition {
        /**
         * The field to apply the condition on
         */
        key: string;

        /**
         * The operator for the condition
         */
        operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

        /**
         * The value to compare against
         */
        value: unknown;
      }
    }
  }

  export interface Options {
    min_score?: number;

    return_chunks?: boolean;

    return_metadata?: boolean;
  }
}

VectorStores.Files = Files;

export declare namespace VectorStores {
  export {
    type VectorStoreCreateResponse as VectorStoreCreateResponse,
    type VectorStoreRetrieveResponse as VectorStoreRetrieveResponse,
    type VectorStoreUpdateResponse as VectorStoreUpdateResponse,
    type VectorStoreListResponse as VectorStoreListResponse,
    type VectorStoreDeleteResponse as VectorStoreDeleteResponse,
    type VectorStoreSearchResponse as VectorStoreSearchResponse,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
    type VectorStoreSearchParams as VectorStoreSearchParams,
  };

  export {
    Files as Files,
    type FileCreateResponse as FileCreateResponse,
    type FileRetrieveResponse as FileRetrieveResponse,
    type FileListResponse as FileListResponse,
    type FileDeleteResponse as FileDeleteResponse,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };
}
