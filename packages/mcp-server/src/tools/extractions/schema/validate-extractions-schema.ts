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
  name: 'validate_extractions_schema',
  description:
    'Validate a schema.\n\nArgs:\n    params: The parameters for validating a schema.\n\nReturns:\n    The validation result.',
  inputSchema: {
    type: 'object',
    properties: {
      json_schema: {
        type: 'object',
        title: 'Json Schema',
        description: 'The JSON schema to validate',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.extractions.schema.validate(body);
};

export default { metadata, tool, handler };
