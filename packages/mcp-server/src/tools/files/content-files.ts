// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'files',
  operation: 'read',
  tags: [],
};

export const tool: Tool = {
  name: 'content_files',
  description:
    'Download a specific file by its ID.\n\nArgs:\n    file_id: The ID of the file to download.\n\nReturns:\n    FileStreamResponse: The response containing the file to be downloaded.',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file to download',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { file_id } = args;
  return client.files.content(file_id);
};

export default { metadata, tool, handler };
