import { z } from 'zod';
import { SearchQuerySchema } from './vaildations';
import { FileSearchResponse } from '@mixedbread/sdk/resources/vector-stores.mjs';

export interface SearchMetadata {
  title?: string;
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

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  error?: Error;
}

export interface Thread {
  id: string;
  messages: Message[];
  isLoading?: boolean;
  error?: Error;
}

export interface ComposerState {
  value: string;
  isSubmitting: boolean;
}

export type SendMessageFunc = (content: string) => Promise<void>;
