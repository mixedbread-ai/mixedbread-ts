// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { AbstractPage, Response, APIClient, FinalRequestOptions, PageInfo } from './core';

export interface OffsetPageResponse<Item> {
  data: Array<Item>;

  pagination: OffsetPageResponse.Pagination;
}

export namespace OffsetPageResponse {
  export interface Pagination {
    count?: number;

    total?: number;
  }
}

export interface OffsetPageParams {
  /**
   * The number of elements to skip.
   */
  offset?: number;

  /**
   * The maximum number of elements to fetch.
   */
  limit?: number;
}

export class OffsetPage<Item> extends AbstractPage<Item> implements OffsetPageResponse<Item> {
  data: Array<Item>;

  pagination: OffsetPageResponse.Pagination;

  constructor(
    client: APIClient,
    response: Response,
    body: OffsetPageResponse<Item>,
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
  nextPageParams(): Partial<OffsetPageParams> | null {
    const info = this.nextPageInfo();
    if (!info) return null;
    if ('params' in info) return info.params;
    const params = Object.fromEntries(info.url.searchParams);
    if (!Object.keys(params).length) return null;
    return params;
  }

  nextPageInfo(): PageInfo | null {
    const offset = this.pagination?.count;
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
