import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchState, SearchResult } from '@/types';
import { debounce } from '@/utils/debounce';

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, minQueryLength = 2 } = options;
  
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    total: 0,
  });

  const requestIdRef = useRef(0);

  const search = useCallback(async (query: string) => {
    if (query.length < minQueryLength) {
      setState(prev => ({
        ...prev,
        query,
        results: [],
        loading: false,
        error: null,
        total: 0,
      }));
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    setState(prev => ({
      ...prev,
      query,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();

      if (currentRequestId === requestIdRef.current) {
        setState(prev => ({
          ...prev,
          results: data.results,
          total: data.total,
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      if (currentRequestId === requestIdRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    }
  }, [minQueryLength]);

  const debouncedSearch = useCallback(
    debounce(search, debounceMs),
    [search, debounceMs]
  );

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    ...state,
    setQuery,
  };
}
