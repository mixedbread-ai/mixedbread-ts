// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from 'mixedbread';
import { Response } from 'node-fetch';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource serviceStatus', () => {
  test('retrieve', async () => {
    const responsePromise = client.serviceStatus.retrieve();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(client.serviceStatus.retrieve({ path: '/_stainless_unknown_path' })).rejects.toThrow(
      Mixedbread.NotFoundError,
    );
  });

  test('rerank: only required params', async () => {
    const responsePromise = client.serviceStatus.rerank({
      input: ['Document 1', 'Document 2'],
      query: 'What is mixedbread ai?',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('rerank: required and optional params', async () => {
    const response = await client.serviceStatus.rerank({
      input: ['Document 1', 'Document 2'],
      query: 'What is mixedbread ai?',
      model: 'mixedbread-ai/mxbai-rerank-large-v1',
      rank_fields: ['field1', 'field2'],
      return_input: false,
      top_k: 10,
    });
  });
});
