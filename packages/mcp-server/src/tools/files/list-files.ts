// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'files',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'list_files',
  description:
    'List all files for the authenticated user.\n\nArgs:\n    pagination: The pagination options\n\nReturns:\n    A list of files belonging to the user.',
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
  return client.files.list(body);
};

export default { metadata, tool, handler };
