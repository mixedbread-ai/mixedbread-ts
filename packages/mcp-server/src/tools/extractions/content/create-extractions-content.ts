// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'extractions.content',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'create_extractions_content',
  description:
    'Extract content from a string using the provided schema.\n\nArgs:\n    params: The parameters for extracting content from a string.\n\nReturns:\n    The extracted content.',
  inputSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        title: 'Content',
        description: 'The content to extract from',
      },
      json_schema: {
        type: 'object',
        title: 'Json Schema',
        description: 'The JSON schema to use for extraction',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.extractions.content.create(body);
};

export default { metadata, tool, handler };
