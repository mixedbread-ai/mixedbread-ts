import { mxbai } from './mxbai';
import { Result, SearchMetadata, TransformFunc } from './types';
import { SearchQuerySchema } from './vaildations';
import { BadRequestError, InternalServerError } from './errors';

export async function search(
  rawParams: Record<string, unknown>,
  transform?: TransformFunc,
): Promise<Result[]> {
  if (!process.env.MXBAI_API_KEY || !process.env.VECTOR_STORE_ID) {
    throw new InternalServerError('Environment setup failed');
  }

  // Validate parameters
  const validation = SearchQuerySchema.safeParse(rawParams);

  if (!validation.success) {
    throw new BadRequestError('Invalid request parameters');
  }

  const data = validation.data;

  const { query, topK } = data;

  const res = await mxbai.vectorStores.files.search({
    query,
    vector_store_ids: [process.env.VECTOR_STORE_ID],
    top_k: topK,
    search_options: {
      return_metadata: true,
      return_chunks: true,
      chunks_per_file: 2,
    },
  });

  if (transform) {
    return transform(res.data);
  }

  const results = res.data.map((item) => {
    const metadata = item.metadata as SearchMetadata;
    return {
      id: item.id,
      url: metadata?.url || '#',
      title: metadata?.title || 'Untitled',
      tag: metadata?.tag || 'all',
      breadcrumb: metadata?.breadcrumb || [],
    };
  });

  return results;
}
