// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores.files',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'create_vector_stores_files',
  description:
    'Upload a new file to a vector store for indexing.\n\nArgs:\n    vector_store_id: The ID of the vector store to upload to\n    file: The file to upload and index\n\nReturns:\n    VectorStoreFile: Details of the uploaded and indexed file',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_id: {
        type: 'string',
        title: 'Vector Store Id',
        description: 'The ID of the vector store',
      },
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'ID of the file to add',
      },
      metadata: {
        type: 'object',
        title: 'Metadata',
        description: 'Optional metadata for the file',
      },
      experimental: {
        type: 'object',
        title: 'VectorStoreFileUpsertExperimental',
        description: 'Strategy for adding the file',
        properties: {
          parsing_strategy: {
            type: 'string',
            title: 'VectorStoreFileUpsertStrategy',
            description: 'Strategy for adding the file',
            enum: ['fast', 'high_quality'],
          },
          contextualization: {
            type: 'boolean',
            title: 'Contextualization',
            description: 'Whether to contextualize the file',
          },
        },
        required: [],
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { vector_store_id, ...body } = args;
  return client.vectorStores.files.create(vector_store_id, body);
};

export default { metadata, tool, handler };
