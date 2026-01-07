// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource stores', () => {
  test('create', async () => {
    const responsePromise = client.stores.create({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve', async () => {
    const responsePromise = client.stores.retrieve('store_identifier');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update', async () => {
    const responsePromise = client.stores.update('store_identifier', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.stores.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.stores.list(
        {
          limit: 10,
          after: 'eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMVQyMzo1OTo1OS4wMDBaIiwiaWQiOiJhYmMxMjMifQ==',
          before: 'eyJjcmVhdGVkX2F0IjoiMjAyNC0xMi0zMVQyMzo1OTo1OS4wMDBaIiwiaWQiOiJhYmMxMjMifQ==',
          include_total: false,
          q: 'x',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mixedbread.NotFoundError);
  });

  test('delete', async () => {
    const responsePromise = client.stores.delete('store_identifier');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('metadataFacets: only required params', async () => {
    const responsePromise = client.stores.metadataFacets({ store_identifiers: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('metadataFacets: required and optional params', async () => {
    const response = await client.stores.metadataFacets({
      query: 'how to configure SSL',
      store_identifiers: ['string'],
      top_k: 1,
      filters: {
        all: [{}, {}],
        any: [{}, {}],
        none: [{}, {}],
      },
      file_ids: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
      search_options: {
        score_threshold: 0,
        rewrite_query: true,
        rerank: true,
        agentic: true,
        return_metadata: true,
        apply_search_rules: true,
      },
      facets: ['string'],
    });
  });

  test('questionAnswering: only required params', async () => {
    const responsePromise = client.stores.questionAnswering({ store_identifiers: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('questionAnswering: required and optional params', async () => {
    const response = await client.stores.questionAnswering({
      query: 'x',
      store_identifiers: ['string'],
      top_k: 1,
      filters: {
        all: [{}, {}],
        any: [{}, {}],
        none: [{}, {}],
      },
      file_ids: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
      search_options: {
        score_threshold: 0,
        rewrite_query: true,
        rerank: true,
        agentic: true,
        return_metadata: true,
        apply_search_rules: true,
      },
      stream: true,
      qa_options: { cite: true, multimodal: true },
    });
  });

  test('search: only required params', async () => {
    const responsePromise = client.stores.search({
      query: 'how to configure SSL',
      store_identifiers: ['string'],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('search: required and optional params', async () => {
    const response = await client.stores.search({
      query: 'how to configure SSL',
      store_identifiers: ['string'],
      top_k: 1,
      filters: {
        all: [{}, {}],
        any: [{}, {}],
        none: [{}, {}],
      },
      file_ids: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
      search_options: {
        score_threshold: 0,
        rewrite_query: true,
        rerank: true,
        agentic: true,
        return_metadata: true,
        apply_search_rules: true,
      },
    });
  });
});
