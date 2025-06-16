// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from '@mixedbread/mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Mixedbread from '@mixedbread/sdk';

export const metadata: Metadata = {
  resource: 'vector_stores',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/vector_stores/search',
  operationId: 'search_vector_store_chunks',
};

export const tool: Tool = {
  name: 'search_vector_stores',
  description:
    'Perform semantic search across vector store chunks.\n\nThis endpoint searches through vector store chunks using semantic similarity matching.\nIt supports complex search queries with filters and returns relevance-scored results.\n\nArgs:\n    search_params: Search configuration including:\n        - query text or embeddings\n        - vector_store_ids: List of vector stores to search\n        - file_ids: Optional list of file IDs to filter chunks by (or tuple of list and condition operator)\n        - metadata filters\n        - pagination parameters\n        - sorting preferences\n    _state: API state dependency\n    _ctx: Service context dependency\n\nReturns:\n    VectorStoreSearchChunkResponse containing:\n        - List of matched chunks with relevance scores\n        - Pagination details including total result count\n\nRaises:\n    HTTPException (400): If search parameters are invalid\n    HTTPException (404): If no vector stores are found to search',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        title: 'Query',
        description: 'Search query text',
      },
      vector_store_identifiers: {
        type: 'array',
        title: 'Vector Store Identifiers',
        description: 'IDs or names of vector stores to search',
        items: {
          type: 'string',
        },
      },
      vector_store_ids: {
        type: 'array',
        title: 'Vector Store Ids',
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
            $ref: '#/$defs/search_filter',
          },
          {
            $ref: '#/$defs/search_filter_condition',
          },
          {
            type: 'array',
            items: {
              anyOf: [
                {
                  $ref: '#/$defs/search_filter',
                },
                {
                  $ref: '#/$defs/search_filter_condition',
                },
              ],
              description: 'Represents a filter with AND, OR, and NOT conditions.',
            },
          },
        ],
        title: 'Filters',
        description: 'Optional filter conditions',
      },
      file_ids: {
        anyOf: [
          {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
        title: 'File Ids',
        description: 'Optional list of file IDs to filter chunks by (inclusion filter)',
      },
      search_options: {
        $ref: '#/$defs/vector_store_chunk_search_options',
      },
    },
    $defs: {
      search_filter: {
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
                  $ref: '#/$defs/search_filter',
                },
                {
                  $ref: '#/$defs/search_filter_condition',
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
                  $ref: '#/$defs/search_filter',
                },
                {
                  $ref: '#/$defs/search_filter_condition',
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
                  $ref: '#/$defs/search_filter',
                },
                {
                  $ref: '#/$defs/search_filter_condition',
                },
              ],
              description: 'Represents a filter with AND, OR, and NOT conditions.',
            },
          },
        },
        required: [],
      },
      search_filter_condition: {
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
            enum: ['eq', 'not_eq', 'gt', 'gte', 'lt', 'lte', 'in', 'not_in', 'like', 'not_like'],
          },
        },
        required: ['key', 'value', 'operator'],
      },
      vector_store_chunk_search_options: {
        type: 'object',
        title: 'VectorStoreChunkSearchOptions',
        description: 'Options for configuring vector store chunk searches.',
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
          rerank: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                $ref: '#/$defs/rerank_config',
              },
            ],
            title: 'Rerank',
            description: 'Whether to rerank results and optional reranking configuration',
          },
          return_metadata: {
            type: 'boolean',
            title: 'Return Metadata',
            description: 'Whether to return file metadata',
          },
        },
        required: [],
      },
      rerank_config: {
        type: 'object',
        title: 'RerankConfig',
        description: 'Represents a reranking configuration.',
        properties: {
          model: {
            type: 'string',
            title: 'Model',
            description: 'The name of the reranking model',
          },
          with_metadata: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'With Metadata',
            description: 'Whether to include metadata in the reranked results',
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description:
              'Maximum number of results to return after reranking. If None, returns all reranked results.',
          },
        },
        required: [],
      },
    },
  },
};

export const handler = async (client: Mixedbread, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.vectorStores.search(body));
};

export default { metadata, tool, handler };
