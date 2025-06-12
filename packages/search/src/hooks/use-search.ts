import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface Result {
  id: string;
  url: string;
  title: string;
  tag: string;
  breadcrumb: string[];
  preview: string;
  external?: boolean;
}

export interface UseSearchConfig {
  /**
   * API endpoint path
   * @default "/api/search"
   */
  apiPath?: string;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Maximum number of results to return
   * @default 10
   */
  topK?: number;
}

export interface UseSearchReturn {
  /** Current search query */
  search: string;

  /** Set search query */
  setSearch: (query: string) => void;

  /** Search results */
  results: Result[];

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** Reset search state */
  reset: () => void;
}

/**
 * Custom hook for implementing search functionality with mixedbread vector store
 *
 * @param config - Configuration options for the search
 * @returns Search state and handlers
 *
 * @example
 * ```tsx
 * const { search, setSearch, results, isLoading, error } = useSearch({
 *   apiPath: '/api/search',
 *   debounceMs: 300,
 *   topK: 10
 * });
 * ```
 */
export function useSearch(config: UseSearchConfig = {}): UseSearchReturn {
  const { apiPath = '/api/search', debounceMs = 300, topK = 10 } = config;

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(
    async (query: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Don't search for empty queries
      if (query.length === 0) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Create new abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const searchParams = new URLSearchParams({
          query,
          top_k: topK.toString(),
        });

        const response = await fetch(`${apiPath}?${searchParams}`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as Result[];

        // Validate results structure
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }

        setResults(data);
      } catch (err) {
        // Don't set error for aborted requests
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiPath, topK],
  );

  // Debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(search);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search, performSearch, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setSearch('');
    setResults([]);
    setError(null);
    setIsLoading(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return useMemo(
    () => ({
      search,
      setSearch,
      results,
      isLoading,
      error,
      reset,
    }),
    [search, results, isLoading, error, reset],
  );
}
