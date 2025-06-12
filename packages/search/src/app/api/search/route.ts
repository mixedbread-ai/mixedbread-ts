import { NextRequest, NextResponse } from 'next/server';
import { mxbai } from '@/lib/mxbai';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';
import { ScoredTextInputChunk } from '@mixedbread/sdk/resources';

interface SearchMetadata {
  title?: string;
  path?: string;
  source_url?: string;
  tag?: string;
}

function createPreviewSnippet(text: string, query: string, maxLength: number = 200): string {
  // First parse frontmatter and get content
  const { content } = matter(text);

  // Remove headers/titles completely before processing
  const contentWithoutTitles = content
    .replace(/^#{1,6}\s+.*$/gm, '') // Remove entire header lines
    .replace(/\n\s*\n/g, '\n') // Clean up extra newlines
    .trim();

  // Use remove-markdown to convert to plain text
  const cleanText = removeMd(contentWithoutTitles)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Find the best match position (case-insensitive)
  const queryLower = query.toLowerCase();
  const textLower = cleanText.toLowerCase();

  // Try to find exact query match first
  let matchIndex = textLower.indexOf(queryLower);

  // If no exact match, try to find individual words
  if (matchIndex === -1) {
    const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2);
    for (const word of queryWords) {
      matchIndex = textLower.indexOf(word);
      if (matchIndex !== -1) break;
    }
  }

  // If still no match, start from beginning
  if (matchIndex === -1) {
    matchIndex = 0;
  }

  // Calculate snippet boundaries - place match closer to start for better mobile display
  const beforeMatch = Math.floor(maxLength * 0.2); // 20% before the match
  let start = Math.max(0, matchIndex - beforeMatch);
  let end = Math.min(cleanText.length, start + maxLength);

  // Adjust to word boundaries
  if (start > 0) {
    const spaceIndex = cleanText.lastIndexOf(' ', start);
    if (spaceIndex !== -1 && spaceIndex > start - 20) {
      start = spaceIndex + 1;
    }
  }

  if (end < cleanText.length) {
    const spaceIndex = cleanText.indexOf(' ', end);
    if (spaceIndex !== -1 && spaceIndex < end + 20) {
      end = spaceIndex;
    }
  }

  let snippet = cleanText.substring(start, end);

  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet;
  if (end < cleanText.length) snippet = snippet + '...';

  return snippet;
}

export async function GET(request: NextRequest) {
  if (!process.env.MXBAI_API_KEY || !process.env.VECTOR_STORE_ID) {
    return NextResponse.json({ error: 'Environment setup failed' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const topKParam = searchParams.get('top_k');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  // Parse top_k with fallback to default value
  const topK = topKParam ? parseInt(topKParam, 10) : 10;

  // Validate top_k is a reasonable number
  if (isNaN(topK) || topK < 1 || topK > 100) {
    return NextResponse.json({ error: 'Invalid top_k value' }, { status: 400 });
  }

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

  const results = res.data.map((item) => {
    const firstChunk = item.chunks?.[0] as ScoredTextInputChunk;
    const preview = firstChunk?.text ? createPreviewSnippet(firstChunk.text, query) : '';

    return {
      id: item.id,
      url: (item.metadata as SearchMetadata)?.source_url || '#',
      title: (item.metadata as SearchMetadata)?.title || 'Untitled',
      tag: (item.metadata as SearchMetadata)?.tag || 'all',
      breadcrumb: ['App', 'Documentation', 'API Reference'],
      preview,
    };
  });

  return NextResponse.json(results);
}
