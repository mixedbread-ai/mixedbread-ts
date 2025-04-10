// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'parsing.jobs',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'list_parsing_jobs',
  description:
    'List parsing jobs with pagination.\n\nArgs:\n    limit: The number of items to return.\n    offset: The number of items to skip.\n\nReturns:\n    List of parsing jobs with pagination.',
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
  return client.parsing.jobs.list(body);
};

export default { metadata, tool, handler };
