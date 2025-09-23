// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource files', () => {
  test('create: only required params', async () => {
    const responsePromise = client.vectorStores.files.create('vector_store_identifier', {
      file_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.vectorStores.files.create('vector_store_identifier', {
      metadata: {},
      experimental: { parsing_strategy: 'fast', contextualization: true },
      file_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  test('retrieve: only required params', async () => {
    const responsePromise = client.vectorStores.files.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_identifier: 'vector_store_identifier',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: required and optional params', async () => {
    const response = await client.vectorStores.files.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_identifier: 'vector_store_identifier',
      return_chunks: true,
    });
  });

  test('list', async () => {
    const responsePromise = client.vectorStores.files.list('vector_store_identifier', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: only required params', async () => {
    const responsePromise = client.vectorStores.files.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_identifier: 'vector_store_identifier',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: required and optional params', async () => {
    const response = await client.vectorStores.files.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_identifier: 'vector_store_identifier',
    });
  });

  test('search: only required params', async () => {
    const responsePromise = client.vectorStores.files.search({
      query: 'how to configure SSL',
      vector_store_identifiers: ['string'],
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
    const response = await client.vectorStores.files.search({
      query: 'how to configure SSL',
      vector_store_identifiers: ['string'],
      top_k: 1,
      filters: {
        all: [
          { any: [{ none: [{}, {}] }, { none: [{}, {}] }], none: [{ any: [{}, {}] }, { any: [{}, {}] }] },
          { any: [{ none: [{}, {}] }, { none: [{}, {}] }], none: [{ any: [{}, {}] }, { any: [{}, {}] }] },
        ],
        any: [
          { all: [{ none: [{}, {}] }, { none: [{}, {}] }], none: [{ all: [{}, {}] }, { all: [{}, {}] }] },
          { all: [{ none: [{}, {}] }, { none: [{}, {}] }], none: [{ all: [{}, {}] }, { all: [{}, {}] }] },
        ],
        none: [
          { all: [{ any: [{}, {}] }, { any: [{}, {}] }], any: [{ all: [{}, {}] }, { all: [{}, {}] }] },
          { all: [{ any: [{}, {}] }, { any: [{}, {}] }], any: [{ all: [{}, {}] }, { all: [{}, {}] }] },
        ],
      },
      file_ids: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
      search_options: {
        score_threshold: 0,
        rewrite_query: true,
        rerank: true,
        return_metadata: true,
        return_chunks: true,
        chunks_per_file: 0,
        apply_search_rules: true,
      },
    });
  });
});
