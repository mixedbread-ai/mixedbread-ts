// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from 'mixedbread';
import { Response } from 'node-fetch';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('top level methods', () => {
  test('embed: only required params', async () => {
    const responsePromise = client.embed({
      input: 'This is a sample text input.',
      model: 'mixedbread-ai/mxbai-embed-large-v1',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('embed: required and optional params', async () => {
    const response = await client.embed({
      input: 'This is a sample text input.',
      model: 'mixedbread-ai/mxbai-embed-large-v1',
      dimensions: 768,
      encoding_format: 'float',
      normalized: true,
      prompt: 'Provide a detailed summary of the following text.',
    });
  });

  test('rerank: only required params', async () => {
    const responsePromise = client.rerank({ input: {}, query: 'What is mixedbread ai?' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('rerank: required and optional params', async () => {
    const response = await client.rerank({
      input: {},
      query: 'What is mixedbread ai?',
      model: 'mixedbread-ai/mxbai-rerank-large-v1',
      rank_fields: ['field1', 'field2'],
      return_input: false,
      top_k: 10,
    });
  });

  test('status', async () => {
    const responsePromise = client.status();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('status: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(client.status({ path: '/_stainless_unknown_path' })).rejects.toThrow(
      Mixedbread.NotFoundError,
    );
  });
});
