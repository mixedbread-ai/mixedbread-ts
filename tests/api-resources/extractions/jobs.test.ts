// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource jobs', () => {
  test('create: only required params', async () => {
    const responsePromise = client.extractions.jobs.create({
      file_id: 'file_id',
      json_schema: { foo: 'bar' },
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
    const response = await client.extractions.jobs.create({
      file_id: 'file_id',
      json_schema: { foo: 'bar' },
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.extractions.jobs.retrieve('job_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
