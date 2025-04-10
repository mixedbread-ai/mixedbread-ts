// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores.files',
  operation: 'write',
  tags: [],
};

export const tool: Tool = {
  name: 'search_vector_stores_files',
  description:
    'Perform semantic search across complete vector store files.\n\nThis endpoint searches through vector store files using semantic similarity matching.\nUnlike chunk search, it returns complete matching files rather than individual chunks.\nSupports complex search queries with filters and returns relevance-scored results.\n\nArgs:\n    search_params: Search configuration including:\n        - query text or embeddings\n        - metadata filters\n        - pagination parameters\n        - sorting preferences\n    _state: API state dependency\n    _ctx: Service context dependency\n\nReturns:\n    VectorStoreSearchFileResponse containing:\n        - List of matched files with relevance scores\n        - Pagination details including total result count\n\nRaises:\n    HTTPException (400): If search parameters are invalid\n    HTTPException (404): If no vector stores are found to search',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        title: 'Query',
        description: 'Search query text',
      },
      vector_store_ids: {
        type: 'array',
        title: 'Vector Store Ids',
        description: 'IDs of vector stores to search',
        items: {
          type: 'string',
        },
      },
      top_k: {
        type: 'integer',
        title: 'Top K',
        description: 'Number of results to return',
      },
      filters: {
        anyOf: [
          {
            type: 'object',
            title: 'SearchFilter',
            description: 'Represents a filter with AND, OR, and NOT conditions.',
            properties: {
              all: {
                type: 'array',
                title: 'All',
                description: 'List of conditions or filters to be ANDed together',
                items: {
                  anyOf: [
                    {
                      $ref: '#/properties/filters/anyOf/0',
                    },
                    {
                      type: 'object',
                      title: 'SearchFilterCondition',
                      description: 'Represents a condition with a field, operator, and value.',
                      properties: {
                        key: {
                          type: 'string',
                          title: 'Key',
                          description: 'The field to apply the condition on',
                        },
                        value: {
                          type: 'object',
                          title: 'Value',
                          description: 'The value to compare against',
                        },
                        operator: {
                          type: 'string',
                          title: 'ConditionOperator',
                          description: 'The operator for the condition',
                          enum: [
                            'eq',
                            'not_eq',
                            'gt',
                            'gte',
                            'lt',
                            'lte',
                            'in',
                            'not_in',
                            'like',
                            'not_like',
                          ],
                        },
                      },
                      required: ['key', 'value', 'operator'],
                    },
                  ],
                  description: 'Represents a filter with AND, OR, and NOT conditions.',
                },
              },
              any: {
                type: 'array',
                title: 'Any',
                description: 'List of conditions or filters to be ORed together',
                items: {
                  anyOf: [
                    {
                      $ref: '#/properties/filters/anyOf/0',
                    },
                    {
                      $ref: '#/properties/filters/anyOf/0/all/items/anyOf/1',
                    },
                  ],
                  description: 'Represents a filter with AND, OR, and NOT conditions.',
                },
              },
              none: {
                type: 'array',
                title: 'None',
                description: 'List of conditions or filters to be NOTed',
                items: {
                  anyOf: [
                    {
                      $ref: '#/properties/filters/anyOf/0',
                    },
                    {
                      $ref: '#/properties/filters/anyOf/0/all/items/anyOf/1',
                    },
                  ],
                  description: 'Represents a filter with AND, OR, and NOT conditions.',
                },
              },
            },
            required: [],
          },
          {
            $ref: '#/properties/filters/anyOf/0/all/items/anyOf/1',
          },
          {
            type: 'array',
            items: {
              anyOf: [
                {
                  $ref: '#/properties/filters/anyOf/0',
                },
                {
                  $ref: '#/properties/filters/anyOf/0/all/items/anyOf/1',
                },
              ],
              description: 'Represents a filter with AND, OR, and NOT conditions.',
            },
          },
        ],
        title: 'Filters',
        description: 'Optional filter conditions',
      },
      search_options: {
        type: 'object',
        title: 'VectorStoreFileSearchOptions',
        description: 'Options for configuring vector store file searches.',
        properties: {
          score_threshold: {
            type: 'number',
            title: 'Score Threshold',
            description: 'Minimum similarity score threshold',
          },
          rewrite_query: {
            type: 'boolean',
            title: 'Rewrite Query',
            description: 'Whether to rewrite the query',
          },
          return_metadata: {
            type: 'boolean',
            title: 'Return Metadata',
            description: 'Whether to return file metadata',
          },
          return_chunks: {
            type: 'boolean',
            title: 'Return Chunks',
            description: 'Whether to return matching text chunks',
          },
          chunks_per_file: {
            type: 'integer',
            title: 'Chunks Per File',
            description: 'Number of chunks to return for each file',
          },
        },
        required: [],
      },
    },
  },
};

export const handler = (client: Mixedbread, args: any) => {
  const { ...body } = args;
  return client.vectorStores.files.search(body);
};

export default { metadata, tool, handler };
