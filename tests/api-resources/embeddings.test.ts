// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';
import { Response } from 'node-fetch';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource embeddings', () => {
  test('create: only required params', async () => {
    const responsePromise = client.embeddings.create({
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

  test('create: required and optional params', async () => {
    const response = await client.embeddings.create({
      input: 'This is a sample text input.',
      model: 'mixedbread-ai/mxbai-embed-large-v1',
      dimensions: 768,
      encoding_format: 'float',
      normalized: true,
      prompt: 'Provide a detailed summary of the following text.',
    });
  });
});
