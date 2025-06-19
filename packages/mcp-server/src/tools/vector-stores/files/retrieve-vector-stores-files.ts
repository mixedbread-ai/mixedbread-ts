// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from '@mixedbread/mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores.files',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/vector_stores/{vector_store_identifier}/files/{file_id}',
  operationId: 'retrieve_vector_store_file',
};

export const tool: Tool = {
  name: 'retrieve_vector_stores_files',
  description:
    'Get details of a specific file in a vector store.\n\nArgs:\n    vector_store_identifier: The ID or name of the vector store\n    file_id: The ID of the file\n\nReturns:\n    VectorStoreFile: Details of the vector store file',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_identifier: {
        type: 'string',
        title: 'Vector Store Identifier',
        description: 'The ID or name of the vector store',
      },
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file',
      },
    },
  },
};

export const handler = async (client: Mixedbread, args: Record<string, unknown> | undefined) => {
  const { file_id, ...body } = args as any;
  return asTextContentResult(await client.vectorStores.files.retrieve(file_id, body));
};

export default { metadata, tool, handler };
