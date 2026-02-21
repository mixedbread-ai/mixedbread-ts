import { adapters } from '@/search/adapters';

interface SearchMetadata {
  title?: string;
  source_url?: string;
  tag?: string;
  breadcrumb?: string[];
}

export const GET = adapters.nextAppHandler({
  transform: (results) => {
    return results.map((result) => {
      const metadata = result.metadata as SearchMetadata;
      return {
        id: result.id,
        url: metadata.source_url || '#',
        title: metadata.title || 'Untitled',
        tag: metadata.tag || '',
        breadcrumb: metadata.breadcrumb || [],
      };
    });
  },
});
