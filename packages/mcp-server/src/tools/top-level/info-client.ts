// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'info_client',
  description:
    'Returns service information, including name and version.\n\nReturns:\n    InfoResponse: A response containing the service name and version.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const {} = args;
  return client.info();
};

export default { metadata, tool, handler };
