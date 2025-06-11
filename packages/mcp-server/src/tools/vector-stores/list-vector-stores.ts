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
  httpPath: '/v1/vector_stores',
  operationId: 'list_vector_stores',
};

export const tool: Tool = {
  name: 'list_vector_stores',
  description:
    'List all vector stores with optional search.\n\nArgs:\n    pagination: The pagination options.\n    q: Optional search query to filter vector stores.\n\nReturns:\n    VectorStoreListResponse: The list of vector stores.',
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
      q: {
        type: 'string',
        title: 'Q',
        description: 'Search query for fuzzy matching over name and description fields',
      },
    },
  },
};

export const handler = async (client: Mixedbread, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.vectorStores.list(body));
};

export default { metadata, tool, handler };
