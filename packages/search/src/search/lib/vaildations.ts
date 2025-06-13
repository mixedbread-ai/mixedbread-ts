import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string().min(1, 'Query is required').trim(),
  top_k: z.coerce.number().int().min(1).max(50).default(10),
});
