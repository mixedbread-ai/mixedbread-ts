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
  name: 'enhance_extractions_schema',
  description:
    'Enhance a schema by enriching the descriptions to aid extraction.\n\nArgs:\n    params: The parameters for enhancing a schema.\n\nReturns:\n    The enhanced schema.',
  inputSchema: {
    type: 'object',
    properties: {
      json_schema: {
        type: 'object',
        title: 'Json Schema',
        description: 'The JSON schema to enhance',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.extractions.schema.enhance(body);
};

export default { metadata, tool, handler };
