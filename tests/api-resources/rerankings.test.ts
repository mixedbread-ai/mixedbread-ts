// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from 'mixedbread';
import { Response } from 'node-fetch';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource rerankings', () => {
  test('create: only required params', async () => {
    const responsePromise = client.rerankings.create({ input: {}, query: 'What is mixedbread ai?' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.rerankings.create({
      input: {},
      query: 'What is mixedbread ai?',
      model: 'mixedbread-ai/mxbai-rerank-large-v1',
      rank_fields: ['field1', 'field2'],
      return_input: false,
      top_k: 10,
    });
  });
});
