// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { MixedbreadError } from './error';
import { FinalRequestOptions } from '../internal/request-options';
import { defaultParseResponse } from '../internal/parse';
import { type Mixedbread } from '../client';
import { APIPromise } from './api-promise';
import { type APIResponseProps } from '../internal/parse';
import { maybeObj } from '../internal/utils/values';

export type PageRequestOptions = Pick<FinalRequestOptions, 'query' | 'headers' | 'body' | 'path' | 'method'>;

export abstract class AbstractPage<Item> implements AsyncIterable<Item> {
  #client: Mixedbread;
  protected options: FinalRequestOptions;

  protected response: Response;
  protected body: unknown;

  constructor(client: Mixedbread, response: Response, body: unknown, options: FinalRequestOptions) {
    this.#client = client;
    this.options = options;
    this.response = response;
    this.body = body;
  }

  abstract nextPageRequestOptions(): PageRequestOptions | null;

  abstract getPaginatedItems(): Item[];

  hasNextPage(): boolean {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageRequestOptions() != null;
  }

  async getNextPage(): Promise<this> {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new MixedbreadError(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.',
      );
    }

    return await this.#client.requestAPIList(this.constructor as any, nextOptions);
  }

  async *iterPages(): AsyncGenerator<this> {
    let page: this = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
}

/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export class PagePromise<
    PageClass extends AbstractPage<Item>,
    Item = ReturnType<PageClass['getPaginatedItems']>[number],
  >
  extends APIPromise<PageClass>
  implements AsyncIterable<Item>
{
  constructor(
    client: Mixedbread,
    request: Promise<APIResponseProps>,
    Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass,
  ) {
    super(
      client,
      request,
      async (client, props) =>
        new Page(client, props.response, await defaultParseResponse(client, props), props.options),
    );
  }

  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}

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
    client: Mixedbread,
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

  nextPageRequestOptions(): PageRequestOptions | null {
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
      return {
        ...this.options,
        query: {
          ...maybeObj(this.options.query),
          offset: currentCount,
        },
      };
    }

    return null;
  }
}

export interface CursorResponse<Item> {
  data: Array<Item>;

  pagination: CursorResponse.Pagination;
}

export namespace CursorResponse {
  export interface Pagination {
    first_cursor?: string;

    last_cursor?: string;

    has_more?: boolean;

    total?: number;
  }
}

export interface CursorParams {
  query?: CursorParams.Query;
}

export namespace CursorParams {
  export interface Query {
    /**
     * The cursor to base the request on for the next elements.
     */
    after?: string;

    /**
     * The cursor to base the request on for the previous elements.
     */
    before?: string;

    limit?: number;

    include_total?: boolean;

    q?: boolean;
  }
}

export class Cursor<Item> extends AbstractPage<Item> implements CursorResponse<Item> {
  data: Array<Item>;

  pagination: CursorResponse.Pagination;

  constructor(
    client: Mixedbread,
    response: Response,
    body: CursorResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.pagination = body.pagination || {};
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  override hasNextPage(): boolean {
    if (this.pagination?.has_more === false) {
      return false;
    }

    return super.hasNextPage();
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    if ((this.options.query as Record<string, unknown>)?.['before']) {
      // in reverse
      const first_cursor = this.pagination?.first_cursor;
      if (!first_cursor) {
        return null;
      }

      return {
        ...this.options,
        query: {
          ...maybeObj(this.options.query),
          before: first_cursor,
        },
      };
    }

    const cursor = this.pagination?.last_cursor;
    if (!cursor) {
      return null;
    }

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        after: cursor,
      },
    };
  }
}
