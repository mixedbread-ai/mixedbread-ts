import Mixedbread from '@mixedbread/sdk';
import { FileSearchResponse } from '@mixedbread/sdk/resources/vector-stores';
import { SearchMetadata } from './types';

export interface MixedbreadOptions {
  /**
   * The ID of the vector store to search in
   */
  vectorStoreId: string;

  /**
   * The Mixedbread SDK client instance
   */
  client: Mixedbread;

  /**
   * Filter results with specific tag.
   */
  tag?: string;

  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}

interface SortedResult {
  id: string;
  type: 'page' | 'text' | 'heading';
  content: string;
  url: string;
}

type VectorStoreFile = (FileSearchResponse['data'][number] & { metadata: SearchMetadata })[];

export async function search(query: string, options: MixedbreadOptions): Promise<SortedResult[]> {
  const { client, vectorStoreId, tag } = options;

  if (!query.trim()) {
    return [];
  }

  const res = await client.vectorStores.files.search({
    query,
    vector_store_ids: [vectorStoreId],
    top_k: 10,
    search_options: {
      return_metadata: true,
    },
  });

  const results = (res.data as VectorStoreFile)
    .filter((item) => {
      const metadata = item.metadata;
      return !tag || metadata.tag === tag;
    })
    .map((item) => {
      const metadata = item.metadata;

      const url = metadata.url || '#';
      const title = metadata.title || 'Untitled';

      return {
        id: item.id,
        type: 'page' as const,
        content: title,
        url,
      };
    });

  return results;
}
