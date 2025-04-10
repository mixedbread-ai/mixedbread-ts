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
  name: 'list_vector_stores_files',
  description:
    'List files indexed in a vector store with pagination.\n\nArgs:\n    vector_store_id: The ID of the vector store\n    pagination: Pagination parameters\n\nReturns:\n    VectorStoreFileListResponse: Paginated list of vector store files',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_id: {
        type: 'string',
        title: 'Vector Store Id',
        description: 'The ID of the vector store',
      },
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
  const { vector_store_id, ...body } = args;
  return client.vectorStores.files.list(vector_store_id, body);
};

export default { metadata, tool, handler };
