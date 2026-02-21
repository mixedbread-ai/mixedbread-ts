import { Result } from '@/search/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mockTags = ['Docs', 'API Reference', 'Components'];

export function mockResults(results: Result[]) {
  return results.map((result, index) => {
    let tag;
    if (index < 4) {
      tag = 'Docs';
    } else {
      const remainingTags = mockTags.slice(1);
      const tagIndex = Math.floor((index - 4) / 2) % remainingTags.length;
      tag = remainingTags[tagIndex];
    }

    return {
      ...result,
      breadcrumb: ['Documentation', 'API Reference', 'Components'],
      tag,
    };
  });
}
