// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'parsing.jobs',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'delete_parsing_jobs',
  description:
    'Delete a specific parse job.\n\nArgs:\n    job_id: The ID of the parse job to delete.\n\nReturns:\n    The deleted parsing job.',
  inputSchema: {
    type: 'object',
    properties: {
      job_id: {
        type: 'string',
        title: 'Job Id',
        description: 'The ID of the parse job to delete',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { job_id } = args;
  return client.parsing.jobs.delete(job_id);
};

export default { metadata, tool, handler };
