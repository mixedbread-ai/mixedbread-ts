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
  name: 'create_vector_stores',
  description:
    'Create a new vector store.\n\nArgs:\n    vector_store_create: VectorStoreCreate object containing the name, description, and metadata.\n\nReturns:\n    VectorStore: The response containing the created vector store details.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Name for the new vector store',
      },
      description: {
        type: 'string',
        title: 'Description',
        description: 'Description of the vector store',
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
      file_ids: {
        type: 'array',
        title: 'File Ids',
        description: 'Optional list of file IDs',
        items: {
          type: 'string',
        },
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.vectorStores.create(body);
};

export default { metadata, tool, handler };
