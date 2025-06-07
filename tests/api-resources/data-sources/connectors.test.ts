// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource connectors', () => {
  test('create: only required params', async () => {
    const responsePromise = client.dataSources.connectors.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_id: 'vector_store_id',
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
    const response = await client.dataSources.connectors.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      vector_store_id: 'vector_store_id',
      name: 'name',
      trigger_sync: true,
      metadata: {},
      polling_interval: 1800,
    });
  });

  test('retrieve: only required params', async () => {
    const responsePromise = client.dataSources.connectors.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
    const response = await client.dataSources.connectors.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  test('update: only required params', async () => {
    const responsePromise = client.dataSources.connectors.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: required and optional params', async () => {
    const response = await client.dataSources.connectors.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      name: 'name',
      metadata: { foo: 'bar' },
      trigger_sync: true,
      polling_interval: 1800,
    });
  });

  test('list', async () => {
    const responsePromise = client.dataSources.connectors.list('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
      client.dataSources.connectors.list(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { limit: 1000, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mixedbread.NotFoundError);
  });

  test('delete: only required params', async () => {
    const responsePromise = client.dataSources.connectors.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
    const response = await client.dataSources.connectors.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      data_source_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });
});
