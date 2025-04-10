// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'embed_client',
  description:
    'Create embeddings for text or images using the specified model, encoding format, and normalization.\n\nArgs:\n    params: The parameters for creating embeddings.\n\nReturns:\n    EmbeddingCreateResponse: The response containing the embeddings.',
  inputSchema: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        title: 'Model',
        description: 'The model to use for creating embeddings.',
      },
      input: {
        anyOf: [
          {
            type: 'string',
            description: 'The input to create embeddings for.',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
        title: 'Input',
        description: 'The input to create embeddings for.',
      },
      dimensions: {
        type: 'integer',
        title: 'Dimensions',
        description: 'The number of dimensions to use for the embeddings.',
      },
      prompt: {
        type: 'string',
        title: 'Prompt',
        description: 'The prompt to use for the embedding creation.',
      },
      normalized: {
        type: 'boolean',
        title: 'Normalized',
        description: 'Whether to normalize the embeddings.',
      },
      encoding_format: {
        anyOf: [
          {
            type: 'string',
            title: 'EncodingFormat',
            description: 'Enumeration of encoding formats.',
            enum: ['float', 'float16', 'base64', 'binary', 'ubinary', 'int8', 'uint8'],
          },
          {
            type: 'array',
            items: {
              type: 'string',
              title: 'EncodingFormat',
              description: 'Enumeration of encoding formats.',
              enum: ['float', 'float16', 'base64', 'binary', 'ubinary', 'int8', 'uint8'],
            },
          },
        ],
        title: 'Encoding Format',
        description: 'The encoding format(s) of the embeddings. Can be a single format or a list of formats.',
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.embed(body);
};

export default { metadata, tool, handler };
