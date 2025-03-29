// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';
import { Response } from 'node-fetch';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('top level methods', () => {
  test('embed: only required params', async () => {
    const responsePromise = client.embed({ model: 'mixedbread-ai/mxbai-embed-large-v1', input: ['string'] });
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
      model: 'mixedbread-ai/mxbai-embed-large-v1',
      input: ['string'],
      dimensions: 768,
      prompt: 'Provide a detailed summary of the following text.',
      normalized: true,
      encoding_format: 'float',
    });
  });

  test('info', async () => {
    const responsePromise = client.info();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('info: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(client.info({ path: '/_stainless_unknown_path' })).rejects.toThrow(Mixedbread.NotFoundError);
  });

  test('rerank: only required params', async () => {
    const responsePromise = client.rerank({
      query: 'What is mixedbread ai?',
      input: ['Document 1', 'Document 2'],
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
    const response = await client.rerank({
      model: 'x',
      query: 'What is mixedbread ai?',
      input: ['Document 1', 'Document 2'],
      rank_fields: ['field1', 'field2'],
      top_k: 10,
      return_input: false,
    });
  });
});
