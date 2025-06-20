import pLimit from 'p-limit';

// Export pLimit for direct use
export { default as pLimit } from 'p-limit';

/**
 * Process items with a configurable concurrency limit using p-limit
 * @param items Array of items to process
 * @param processor Function to process each item
 * @param concurrency Maximum number of concurrent operations
 */
export async function processWithConcurrency<T>(
  items: T[],
  processor: (item: T, index: number) => Promise<void>,
  concurrency: number,
): Promise<void> {
  const limit = pLimit(concurrency);

  const promises = items.map((item, index) => limit(() => processor(item, index)));

  await Promise.all(promises);
}
