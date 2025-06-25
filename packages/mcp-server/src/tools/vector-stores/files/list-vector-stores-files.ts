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
  httpPath: '/v1/vector_stores/{vector_store_identifier}/files',
  operationId: 'list_vector_store_files',
};

export const tool: Tool = {
  name: 'list_vector_stores_files',
  description:
    'List files indexed in a vector store with pagination.\n\nArgs:\n    vector_store_identifier: The ID or name of the vector store\n    pagination: Pagination parameters\n\nReturns:\n    VectorStoreFileListResponse: Paginated list of vector store files',
  inputSchema: {
    type: 'object',
    properties: {
      vector_store_identifier: {
        type: 'string',
        title: 'Vector Store Identifier',
        description: 'The ID or name of the vector store',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
        description: 'Maximum number of items to return per page',
      },
      cursor: {
        type: 'string',
        title: 'Cursor',
        description: 'Cursor for pagination (base64 encoded cursor)',
      },
      include_total: {
        type: 'boolean',
        title: 'Include Total',
        description: 'Whether to include the total number of items',
      },
      statuses: {
        type: 'array',
        title: 'Statuses',
        description: 'Status to filter by',
        items: {
          $ref: '#/$defs/vector_store_file_status',
        },
      },
    },
    $defs: {
      vector_store_file_status: {
        type: 'string',
        title: 'VectorStoreFileStatus',
        enum: ['pending', 'in_progress', 'cancelled', 'completed', 'failed'],
      },
    },
  },
};

export const handler = async (client: Mixedbread, args: Record<string, unknown> | undefined) => {
  const { vector_store_identifier, ...body } = args as any;
  return asTextContentResult(await client.vectorStores.files.list(vector_store_identifier, body));
};

export default { metadata, tool, handler };
