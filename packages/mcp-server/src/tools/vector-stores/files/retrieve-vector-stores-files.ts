// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores.files',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'retrieve_vector_stores_files',
  description:
    'Get details of a specific file in a vector store.\n\nArgs:\n    vector_store_id: The ID of the vector store\n    file_id: The ID of the file\n\nReturns:\n    VectorStoreFile: Details of the vector store file',
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
        description: 'The ID of the file',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { file_id, ...body } = args;
  return client.vectorStores.files.retrieve(file_id, body);
};

export default { metadata, tool, handler };
