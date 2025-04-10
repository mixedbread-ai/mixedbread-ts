// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'rerank_client',
  description:
    'Rerank different kind of documents for a given query.\n\nArgs:\n    params: RerankParams: The parameters for reranking.\n\nReturns:\n    RerankResponse: The reranked documents for the input query.',
  inputSchema: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        title: 'Model',
        description: 'The model to use for reranking documents.',
      },
      query: {
        type: 'string',
        title: 'Query',
        description: 'The query to rerank the documents.',
      },
      input: {
        type: 'array',
        title: 'Input',
        description: 'The input documents to rerank.',
        items: {
          anyOf: [
            {
              type: 'string',
            },
            {
              type: 'object',
            },
            {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          ],
        },
      },
      rank_fields: {
        type: 'array',
        title: 'Rank Fields',
        description: 'The fields of the documents to rank.',
        items: {
          type: 'string',
        },
      },
      top_k: {
        type: 'integer',
        title: 'Top K',
        description: 'The number of documents to return.',
      },
      return_input: {
        type: 'boolean',
        title: 'Return Input',
        description: 'Whether to return the documents.',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.rerank(body);
};

export default { metadata, tool, handler };
