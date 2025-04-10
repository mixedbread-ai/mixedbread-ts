// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'list_vector_stores',
  description:
    'List all vector stores.\n\nArgs:\n    pagination: The pagination options.\n\nReturns:\n    VectorStoreListResponse: The list of vector stores.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'integer',
        title: 'Limit',
        description: 'Maximum number of items to return per page',
      },
      offset: {
        type: 'integer',
        title: 'Offset',
        description: 'Offset of the first item to return',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.vectorStores.list(body);
};

export default { metadata, tool, handler };
