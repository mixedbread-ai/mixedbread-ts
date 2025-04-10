// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'files',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'update_files',
  description:
    'Update the details of a specific file.\n\nArgs:\n    file_id: The ID of the file to update.\n    file: The new details for the file.\n\nReturns:\n    FileObject: The updated file details.',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file to update',
      },
      file: {
        type: 'string',
        title: 'File',
        description: 'The file to update',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { file_id, ...body } = args;
  return client.files.update(file_id, body);
};

export default { metadata, tool, handler };
