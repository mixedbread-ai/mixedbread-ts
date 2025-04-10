// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'extractions.schema',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'create_extractions_schema',
  description:
    'Create a schema with the provided parameters.\n\nArgs:\n    params: The parameters for creating a schema.\n\nReturns:\n    The created schema.',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        title: 'Description',
        description: 'Description of the data to extract',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.extractions.schema.create(body);
};

export default { metadata, tool, handler };
