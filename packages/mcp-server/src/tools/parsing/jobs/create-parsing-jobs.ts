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
  name: 'create_parsing_jobs',
  description:
    'Start a parse job for the provided file.\n\nArgs:\n    params: The parameters for creating a parse job.\n\nReturns:\n    The created parsing job.',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
        title: 'File Id',
        description: 'The ID of the file to parse',
      },
      element_types: {
        type: 'array',
        title: 'Element Types',
        description: 'The elements to extract from the document',
        items: {
          type: 'string',
          title: 'ElementType',
          description: 'Types of elements that can be extracted from a document.',
          enum: [
            'caption',
            'footnote',
            'formula',
            'list-item',
            'page-footer',
            'page-header',
            'picture',
            'section-header',
            'table',
            'text',
            'title',
          ],
        },
      },
      chunking_strategy: {
        type: 'string',
        title: 'ChunkingStrategy',
        description: 'The strategy to use for chunking the content',
        enum: ['page'],
      },
      return_format: {
        type: 'string',
        title: 'ReturnFormat',
        description: 'The format of the returned content',
        enum: ['html', 'markdown', 'plain'],
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.parsing.jobs.create(body);
};

export default { metadata, tool, handler };
