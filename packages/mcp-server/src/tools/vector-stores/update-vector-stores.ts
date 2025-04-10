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
  name: 'update_vector_stores',
  description:
    'Update a vector store by ID.\n\nArgs:\n    vector_store_id: The ID of the vector store to update.\n    vector_store_update: VectorStoreCreate object containing the name, description, and metadata.\n\nReturns:\n    VectorStore: The response containing the updated vector store details.',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_id: {
        type: 'string',
        title: 'Vector Store Id',
        description: 'The ID of the vector store',
      },
      name: {
        type: 'string',
        title: 'Name',
        description: 'New name for the vector store',
      },
      description: {
        type: 'string',
        title: 'Description',
        description: 'New description',
      },
      expires_after: {
        type: 'object',
        title: 'ExpiresAfter',
        description: 'Represents an expiration policy for a vector store.',
        properties: {
          anchor: {
            type: 'string',
            title: 'Anchor',
            description: 'Anchor date for the expiration policy',
            enum: ['last_active_at'],
          },
          days: {
            type: 'integer',
            title: 'Days',
            description: 'Number of days after which the vector store expires',
          },
        },
        required: [],
      },
      metadata: {
        type: 'object',
        title: 'Metadata',
        description: 'Optional metadata key-value pairs',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { vector_store_id, ...body } = args;
  return client.vectorStores.update(vector_store_id, body);
};

export default { metadata, tool, handler };
