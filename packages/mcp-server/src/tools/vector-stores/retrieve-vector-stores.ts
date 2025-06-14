// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from '@mixedbread/mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/vector_stores/{vector_store_identifier}',
  operationId: 'retrieve_vector_store',
};

export const tool: Tool = {
  name: 'retrieve_vector_stores',
  description:
    'Get a vector store by ID or name.\n\nArgs:\n    vector_store_identifier: The ID or name of the vector store to retrieve.\n\nReturns:\n    VectorStore: The response containing the vector store details.',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_identifier: {
        type: 'string',
        title: 'Vector Store Identifier',
        description: 'The ID or name of the vector store',
      },
    },
  },
};

export const handler = async (client: Mixedbread, args: Record<string, unknown> | undefined) => {
  const { vector_store_identifier, ...body } = args as any;
  return asTextContentResult(await client.vectorStores.retrieve(vector_store_identifier));
};

export default { metadata, tool, handler };
