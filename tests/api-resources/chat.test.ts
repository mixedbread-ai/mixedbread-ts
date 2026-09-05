// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';

const client = new Mixedbread({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource chat', () => {
  test('createCompletion: only required params', async () => {
    const responsePromise = client.chat.createCompletion({
      messages: [{ role: 'system', content: 'string' }],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('createCompletion: required and optional params', async () => {
    const response = await client.chat.createCompletion({
      messages: [{ role: 'system', content: 'string' }],
      model: 'model',
      tools: [
        {
          store_identifiers: ['string'],
          type: 'search_corpus',
          max_num_results: 1,
          filters: {
            all: [{}, {}],
            any: [{}, {}],
            none: [{}, {}],
          },
          score_threshold: 0,
          citations: true,
        },
      ],
      tool_choice: 'auto',
      store: true,
      previous_completion_id: 'previous_completion_id',
      previous_messages: [{ role: 'system', content: 'string' }],
      terminal_tool_name: 'terminal_tool_name',
      stream: true,
      temperature: 0,
      top_p: 0,
      max_completion_tokens: 16,
      max_tokens: 16,
      max_tool_calls: 1,
      context_management: { edits: [{ type: 'prune_context' }] },
      parallel_tool_calls: true,
      metadata: { foo: 'string' },
      include: ['string'],
    });
  });
});
