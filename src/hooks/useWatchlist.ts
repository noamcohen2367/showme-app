// ============================================
// ShowME App - Watchlist Hook
// ============================================
// Manages two AsyncStorage-backed lists:
//   watchlist → shows the user wants to see
//   watched   → shows the user has already seen

import { useState, useEffect, useCallback } from 'react';
import {
  getWatchlist, saveWatchlist,
  getWatched,   saveWatched,
} from '../storage/mvpStorage';

export interface UseWatchlistReturn {
  watchlist: string[];
  watched: string[];
  loaded: boolean;
  isInWatchlist: (showId: string) => boolean;
  isWatched: (showId: string) => boolean;
  toggleWatchlist: (showId: string) => Promise<void>;
  markAsWatched: (showId: string) => Promise<void>;
  removeFromWatched: (showId: string) => Promise<void>;
  removeFromWatchlist: (showId: string) => Promise<void>;
  /** Call this when the screen gains focus to sync with AsyncStorage */
  reload: () => Promise<void>;
}

export function useWatchlist(): UseWatchlistReturn {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watched,   setWatched]   = useState<string[]>([]);
  const [loaded,    setLoaded]    = useState(false);

  const reload = useCallback(async () => {
    const [wl, wd] = await Promise.all([getWatchlist(), getWatched()]);
    setWatchlist(wl);
    setWatched(wd);
    setLoaded(true);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Watchlist ────────────────────────────────────────────────────────────

  const toggleWatchlist = useCallback(async (showId: string) => {
    setWatchlist(prev => {
      const next = prev.includes(showId)
        ? prev.filter(id => id !== showId)
        : [...prev, showId];
      saveWatchlist(next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback(async (showId: string) => {
    setWatchlist(prev => {
      const next = prev.filter(id => id !== showId);
      saveWatchlist(next);
      return next;
    });
  }, []);

  // ── Watched ──────────────────────────────────────────────────────────────

  /** Moves a show from watchlist → watched */
  const markAsWatched = useCallback(async (showId: string) => {
    setWatchlist(prev => {
      const next = prev.filter(id => id !== showId);
      saveWatchlist(next);
      return next;
    });
    setWatched(prev => {
      if (prev.includes(showId)) return prev;
      const next = [...prev, showId];
      saveWatched(next);
      return next;
    });
  }, []);

  const removeFromWatched = useCallback(async (showId: string) => {
    setWatched(prev => {
      const next = prev.filter(id => id !== showId);
      saveWatched(next);
      return next;
    });
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const isInWatchlist = useCallback(
    (showId: string) => watchlist.includes(showId),
    [watchlist],
  );

  const isWatched = useCallback(
    (showId: string) => watched.includes(showId),
    [watched],
  );

  return {
    watchlist,
    watched,
    loaded,
    isInWatchlist,
    isWatched,
    toggleWatchlist,
    markAsWatched,
    removeFromWatched,
    removeFromWatchlist,
    reload,
  };
}
