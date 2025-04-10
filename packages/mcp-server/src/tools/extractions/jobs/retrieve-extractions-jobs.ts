// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'extractions.jobs',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'retrieve_extractions_jobs',
  description:
    'Get detailed information about a specific extraction job.\n\nArgs:\n    job_id: The ID of the extraction job.\n\nReturns:\n    Detailed information about the extraction job.',
  inputSchema: {
    type: 'object',
    properties: {
      job_id: {
        type: 'string',
        title: 'Job Id',
        description: 'The ID of the extraction job to retrieve',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { job_id } = args;
  return client.extractions.jobs.retrieve(job_id);
};

export default { metadata, tool, handler };
