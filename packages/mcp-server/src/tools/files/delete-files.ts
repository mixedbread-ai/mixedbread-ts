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
  name: 'delete_files',
  description:
    'Delete a specific file by its ID.\n\nArgs:\n    file_id: The ID of the file to delete.\n\nReturns:\n    FileDeleted: The response containing the details of the deleted file.',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file to delete',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { file_id } = args;
  return client.files.delete(file_id);
};

export default { metadata, tool, handler };
