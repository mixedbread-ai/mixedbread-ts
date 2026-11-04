// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource fileBatches', () => {
  test('create: only required params', async () => {
    const responsePromise = client.stores.fileBatches.create('store_identifier', {
      files: [
        {
          file_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          external_id: 'external_id',
          metadata: {},
          config: { parsing_strategy: 'fast' },
        },
      ],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
