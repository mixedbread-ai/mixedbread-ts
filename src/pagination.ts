// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { AbstractPage, Response, APIClient, FinalRequestOptions, PageInfo } from './core';

export interface PageResponse<Item> {
  data: Array<Item>;

  pagination: PageResponse.Pagination;
}

export namespace PageResponse {
  export interface Pagination {
    offset?: number;

    total?: number;
  }
}

export interface PageParams {
  /**
   * The number of elements to skip.
   */
  offset?: number;

  /**
   * The maximum number of elements to fetch.
   */
  limit?: number;
}

export class Page<Item> extends AbstractPage<Item> implements PageResponse<Item> {
  data: Array<Item>;

  pagination: PageResponse.Pagination;

  constructor(client: APIClient, response: Response, body: PageResponse<Item>, options: FinalRequestOptions) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.pagination = body.pagination || {};
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams(): Partial<PageParams> | null {
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
