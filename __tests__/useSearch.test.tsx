import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';

// Mock fetch
global.fetch = jest.fn();

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.total).toBe(0);
  });

  it('should not search for queries shorter than minQueryLength', async () => {
    const { result } = renderHook(() => useSearch({ minQueryLength: 3 }));

    act(() => {
      result.current.setQuery('ab');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should search for valid queries', async () => {
    const mockResponse = {
      results: [{ id: '1', title: 'Test', description: 'Test description', url: 'http://test.com', category: 'Test' }],
      total: 1,
      query: 'test',
      timestamp: Date.now()
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });
    

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/search?q=test');
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResponse.results);
      expect(result.current.total).toBe(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle search errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
    });
  });

  it('should cancel outdated requests', async () => {
    const firstResponse = {
      results: [{ id: '1', title: 'First', description: 'First result', url: 'http://first.com', category: 'Test' }],
      total: 1,
      query: 'first',
      timestamp: Date.now()
    };

    const secondResponse = {
      results: [{ id: '2', title: 'Second', description: 'Second result', url: 'http://second.com', category: 'Test' }],
      total: 1,
      query: 'second',
      timestamp: Date.now()
    };

    let firstResolve: any;
    const firstPromise = new Promise(resolve => { firstResolve = resolve; });

    (fetch as jest.Mock)
      .mockImplementationOnce(() => firstPromise.then(() => ({
        ok: true,
        json: async () => firstResponse,
      })))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondResponse,
      });

    const { result } = renderHook(() => useSearch({ debounceMs: 50 }));

    act(() => {
      result.current.setQuery('first');
    });

    act(() => {
      jest.advanceTimersByTime(50);
    });

    act(() => {
      result.current.setQuery('second');
    });

    act(() => {
      jest.advanceTimersByTime(50);
    });

    await waitFor(() => {
      expect(result.current.query).toBe('second');
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(secondResponse.results);
    });

    act(() => {
      firstResolve();
    });
  });
});
