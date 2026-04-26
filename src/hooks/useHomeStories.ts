// ============================================
// ShowME App - useHomeStories
// Fetches live theater stories from Supabase,
// grouped by theater, in the format HomeScreen expects.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Must match the Story / StorySlide interfaces in HomeScreen
export interface LiveStorySlide {
  id: string;
  imageUrl: string;
  title?: string;
  titleHe?: string;
  subtitle?: string;
  duration: number;
}

export interface LiveStory {
  id: string;
  theaterId: string;
  theaterName: string;
  theaterNameHe: string;
  avatarUrl: string;
  isNew: true;
  slides: LiveStorySlide[];
}

export function useHomeStories() {
  const [stories, setStories] = useState<LiveStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('theater_stories')
        .select(`
          id,
          theater_id,
          image_url,
          caption,
          expires_at,
          created_at,
          theaters (
            name,
            name_he,
            profile_image_url
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error || !data) return;

      // Group slides by theater
      const map = new Map<string, LiveStory>();

      for (const row of data) {
        const theater = row.theaters as {
          name: string;
          name_he: string | null;
          profile_image_url: string | null;
        } | null;

        if (!theater) continue;

        if (!map.has(row.theater_id)) {
          map.set(row.theater_id, {
            id: `live-${row.theater_id}`,
            theaterId: row.theater_id,
            theaterName: theater.name,
            theaterNameHe: theater.name_he ?? theater.name,
            avatarUrl: theater.profile_image_url ?? '',
            isNew: true,
            slides: [],
          });
        }

        map.get(row.theater_id)!.slides.push({
          id: row.id,
          imageUrl: row.image_url,
          title: row.caption ?? undefined,
          titleHe: row.caption ?? undefined,
          duration: 5000,
        });
      }

      setStories(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stories, loading, refresh: fetch };
}
