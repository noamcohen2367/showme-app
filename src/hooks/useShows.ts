// ============================================
// ShowME App - Shows Data Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { Show } from '../types/types';
import { fetchAllShows } from '../services/api';
import { shows as mockShows } from '../data/shows';

// Module-level cache to avoid re-fetching on every mount
let cachedShows: Show[] | null = null;
let fetchPromise: Promise<Show[]> | null = null;

async function getShows(forceRefresh = false): Promise<Show[]> {
  if (cachedShows && !forceRefresh) {
    return cachedShows;
  }

  // Deduplicate concurrent requests
  if (fetchPromise && !forceRefresh) {
    return fetchPromise;
  }

  fetchPromise = fetchAllShows()
    .then((shows) => {
      cachedShows = shows;
      fetchPromise = null;
      return shows;
    })
    .catch((error) => {
      console.warn('Failed to fetch shows from API, using mock data:', error);
      fetchPromise = null;
      // Fallback to mock data
      cachedShows = mockShows;
      return mockShows;
    });

  return fetchPromise;
}

interface UseShowsResult {
  shows: Show[];
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  refetch: () => Promise<void>;
}

export function useShows(): UseShowsResult {
  const [shows, setShows] = useState<Show[]>(cachedShows || []);
  const [loading, setLoading] = useState(!cachedShows);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getShows(forceRefresh);
      setShows(data);
      setIsUsingFallback(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shows');
      // Still show mock data on error
      setShows(mockShows);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    cachedShows = null;
    await fetchData(true);
  }, [fetchData]);

  return { shows, loading, error, isUsingFallback, refetch };
}

interface UseShowResult {
  show: Show | undefined;
  loading: boolean;
  error: string | null;
}

export function useShow(showId: string): UseShowResult {
  const { shows, loading, error } = useShows();
  const show = shows.find((s) => s.id === showId);
  return { show, loading, error };
}
