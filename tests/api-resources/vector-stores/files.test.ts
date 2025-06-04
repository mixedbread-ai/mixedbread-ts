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
      file_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      metadata: {},
      experimental: { parsing_strategy: 'fast', contextualization: true },
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
    });
  });

  test('list', async () => {
    const responsePromise = client.vectorStores.files.list('vector_store_identifier');
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
      client.vectorStores.files.list(
        'vector_store_identifier',
        { limit: 1000, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mixedbread.NotFoundError);
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
    const responsePromise = client.vectorStores.files.search({ query: 'how to configure SSL' });
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
      vector_store_ids: ['string'],
      top_k: 1,
      filters: {
        all: [
          { key: 'price', value: '100', operator: 'gt' },
          { key: 'color', value: 'red', operator: 'eq' },
        ],
        any: [
          { key: 'price', value: '100', operator: 'gt' },
          { key: 'color', value: 'red', operator: 'eq' },
        ],
        none: [
          { key: 'price', value: '100', operator: 'gt' },
          { key: 'color', value: 'red', operator: 'eq' },
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
      },
    });
  });
});
