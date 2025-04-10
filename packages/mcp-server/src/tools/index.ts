// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mixedbread from '@mixedbread/sdk';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

import embed_client from './top-level/embed-client';
import info_client from './top-level/info-client';
import rerank_client from './top-level/rerank-client';
import create_vector_stores from './vector-stores/create-vector-stores';
import retrieve_vector_stores from './vector-stores/retrieve-vector-stores';
import update_vector_stores from './vector-stores/update-vector-stores';
import list_vector_stores from './vector-stores/list-vector-stores';
import delete_vector_stores from './vector-stores/delete-vector-stores';
import question_answering_vector_stores from './vector-stores/question-answering-vector-stores';
import search_vector_stores from './vector-stores/search-vector-stores';
import create_vector_stores_files from './vector-stores/files/create-vector-stores-files';
import retrieve_vector_stores_files from './vector-stores/files/retrieve-vector-stores-files';
import list_vector_stores_files from './vector-stores/files/list-vector-stores-files';
import delete_vector_stores_files from './vector-stores/files/delete-vector-stores-files';
import search_vector_stores_files from './vector-stores/files/search-vector-stores-files';
import create_parsing_jobs from './parsing/jobs/create-parsing-jobs';
import retrieve_parsing_jobs from './parsing/jobs/retrieve-parsing-jobs';
import list_parsing_jobs from './parsing/jobs/list-parsing-jobs';
import delete_parsing_jobs from './parsing/jobs/delete-parsing-jobs';
import cancel_parsing_jobs from './parsing/jobs/cancel-parsing-jobs';
import create_files from './files/create-files';
import retrieve_files from './files/retrieve-files';
import update_files from './files/update-files';
import list_files from './files/list-files';
import delete_files from './files/delete-files';
import content_files from './files/content-files';
import create_extractions_jobs from './extractions/jobs/create-extractions-jobs';
import retrieve_extractions_jobs from './extractions/jobs/retrieve-extractions-jobs';
import create_extractions_schema from './extractions/schema/create-extractions-schema';
import enhance_extractions_schema from './extractions/schema/enhance-extractions-schema';
import validate_extractions_schema from './extractions/schema/validate-extractions-schema';
import create_extractions_content from './extractions/content/create-extractions-content';
import create_embeddings from './embeddings/create-embeddings';

export type HandlerFunction = (client: Mixedbread, args: any) => Promise<any>;

export type Metadata = {
  resource: string;
  operation: 'read' | 'write';
  tags: string[];
};

export type Endpoint = {
  metadata: Metadata;
  tool: Tool;
  handler: HandlerFunction;
};

export const endpoints: Endpoint[] = [];

function addEndpoint(endpoint: Endpoint) {
  endpoints.push(endpoint);
}

addEndpoint(embed_client);
addEndpoint(info_client);
addEndpoint(rerank_client);
addEndpoint(create_vector_stores);
addEndpoint(retrieve_vector_stores);
addEndpoint(update_vector_stores);
addEndpoint(list_vector_stores);
addEndpoint(delete_vector_stores);
addEndpoint(question_answering_vector_stores);
addEndpoint(search_vector_stores);
addEndpoint(create_vector_stores_files);
addEndpoint(retrieve_vector_stores_files);
addEndpoint(list_vector_stores_files);
addEndpoint(delete_vector_stores_files);
addEndpoint(search_vector_stores_files);
addEndpoint(create_parsing_jobs);
addEndpoint(retrieve_parsing_jobs);
addEndpoint(list_parsing_jobs);
addEndpoint(delete_parsing_jobs);
addEndpoint(cancel_parsing_jobs);
addEndpoint(create_files);
addEndpoint(retrieve_files);
addEndpoint(update_files);
addEndpoint(list_files);
addEndpoint(delete_files);
addEndpoint(content_files);
addEndpoint(create_extractions_jobs);
addEndpoint(retrieve_extractions_jobs);
addEndpoint(create_extractions_schema);
addEndpoint(enhance_extractions_schema);
addEndpoint(validate_extractions_schema);
addEndpoint(create_extractions_content);
addEndpoint(create_embeddings);

export type Filter = {
  type: 'resource' | 'operation' | 'tag' | 'tool';
  op: 'include' | 'exclude';
  value: string;
};

export function query(filters: Filter[], endpoints: Endpoint[]): Endpoint[] {
  if (filters.length === 0) {
    return endpoints;
  }
  const allExcludes = filters.every((filter) => filter.op === 'exclude');

  return endpoints.filter((endpoint: Endpoint) => {
    let included = false || allExcludes;

    for (const filter of filters) {
      if (match(filter, endpoint)) {
        included = filter.op === 'include';
      }
    }

    return included;
  });
}

function match({ type, value }: Filter, endpoint: Endpoint): boolean {
  switch (type) {
    case 'resource': {
      const regexStr = '^' + normalizeResource(value).replace(/\*/g, '.*') + '$';
      const regex = new RegExp(regexStr);
      return regex.test(normalizeResource(endpoint.metadata.resource));
    }
    case 'operation':
      return endpoint.metadata.operation === value;
    case 'tag':
      return endpoint.metadata.tags.includes(value);
    case 'tool':
      return endpoint.tool.name === value;
  }
}

function normalizeResource(resource: string): string {
  return resource.toLowerCase().replace(/[^a-z.*\-_]*/g, '');
}
