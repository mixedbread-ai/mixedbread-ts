// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'extractions.jobs',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'create_extractions_jobs',
  description:
    'Start an extraction job for the provided file and schema.\n\nArgs:\n    params: The parameters for creating an extraction job.\n\nReturns:\n    The created extraction job.',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file to extract from',
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
  return client.extractions.jobs.create(body);
};

export default { metadata, tool, handler };
