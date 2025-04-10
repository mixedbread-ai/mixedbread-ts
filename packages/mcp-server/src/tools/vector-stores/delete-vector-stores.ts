// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'delete_vector_stores',
  description:
    'Delete a vector store by ID.\n\nArgs:\n    vector_store_id: The ID of the vector store to delete.\n\nReturns:\n    VectorStore: The response containing the deleted vector store details.',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_id: {
        type: 'string',
        title: 'Vector Store Id',
        description: 'The ID of the vector store to delete',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { vector_store_id } = args;
  return client.vectorStores.delete(vector_store_id);
};

export default { metadata, tool, handler };
