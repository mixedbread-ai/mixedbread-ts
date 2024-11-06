// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from 'mixedbread';
import { Response } from 'node-fetch';

const client = new Mixedbread({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource parse', () => {
  test('createJob: only required params', async () => {
    const responsePromise = client.documentAI.parse.createJob({ file_id: 'file_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('createJob: required and optional params', async () => {
    const response = await client.documentAI.parse.createJob({
      file_id: 'file_id',
      chunking_strategy: 'page',
      element_types: ['string', 'string', 'string'],
      return_format: 'html',
    });
  });

  test('retrieveJob', async () => {
    const responsePromise = client.documentAI.parse.retrieveJob('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveJob: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.documentAI.parse.retrieveJob('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
        path: '/_stainless_unknown_path',
      }),
    ).rejects.toThrow(Mixedbread.NotFoundError);
  });
});
