// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { AbstractPage, Response, APIClient, FinalRequestOptions, PageInfo } from './core';

export interface LimitOffsetResponse<Item> {
  data: Array<Item>;

  pagination: LimitOffsetResponse.Pagination;
}

export namespace LimitOffsetResponse {
  export interface Pagination {
    total?: number;

    offset?: number;
  }
}

export interface LimitOffsetParams {
  /**
   * The number of elements to skip.
   */
  offset?: number;

  /**
   * The maximum number of elements to fetch.
   */
  limit?: number;
}

export class LimitOffset<Item> extends AbstractPage<Item> implements LimitOffsetResponse<Item> {
  data: Array<Item>;

  pagination: LimitOffsetResponse.Pagination;

  constructor(
    client: APIClient,
    response: Response,
    body: LimitOffsetResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.pagination = body.pagination || {};
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams(): Partial<LimitOffsetParams> | null {
    const info = this.nextPageInfo();
    if (!info) return null;
    if ('params' in info) return info.params;
    const params = Object.fromEntries(info.url.searchParams);
    if (!Object.keys(params).length) return null;
    return params;
  }

  nextPageInfo(): PageInfo | null {
    const offset = this.pagination?.offset;
    if (!offset) {
      return null;
    }

    const length = this.getPaginatedItems().length;
    const currentCount = offset + length;

    const totalCount = this.pagination?.total;
    if (!totalCount) {
      return null;
    }

    if (currentCount < totalCount) {
      return { params: { offset: currentCount } };
    }

    return null;
  }
}
