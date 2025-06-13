import { z } from 'zod';
import { SearchQuerySchema } from './vaildations';
import { FileSearchResponse } from '@mixedbread/sdk/resources/vector-stores.mjs';

export interface SearchMetadata {
  title?: string;
  path?: string;
  url?: string;
  tag?: string;
  breadcrumb?: string[];
}

export interface Result {
  id: string;
  url: string;
  title: string;
  tag: string;
  breadcrumb: string[];
  external?: boolean;
}

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export type TransformFunc = (results: FileSearchResponse['data']) => Result[];
