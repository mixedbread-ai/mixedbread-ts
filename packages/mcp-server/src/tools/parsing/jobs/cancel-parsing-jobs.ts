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
  name: 'cancel_parsing_jobs',
  description:
    'Cancel a specific parse job.\n\nArgs:\n    job_id: The ID of the parse job to cancel.\n\nReturns:\n    The cancelled parsing job.',
  inputSchema: {
    type: 'object',
    properties: {
      job_id: {
        type: 'string',
        title: 'Job Id',
        description: 'The ID of the parse job to cancel',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { job_id } = args;
  return client.parsing.jobs.cancel(job_id);
};

export default { metadata, tool, handler };
