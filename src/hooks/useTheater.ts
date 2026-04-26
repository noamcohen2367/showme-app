// ============================================
// ShowME App - useTheater hook
// Fetches theater row + its active stories
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TheaterData {
  id: string;
  name: string;
  nameHe: string;
  profileImageUrl: string | null;
  description: string;
  descriptionHe: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  location: string;
}

export interface TheaterStory {
  id: string;
  imageUrl: string;
  caption: string | null;
  expiresAt: string;
  createdAt: string;
}

export function useTheater(theaterId: string | undefined) {
  const [theater, setTheater] = useState<TheaterData | null>(null);
  const [stories, setStories] = useState<TheaterStory[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!theaterId) return;
    setLoading(true);
    try {
      const [theaterRes, storiesRes] = await Promise.all([
        supabase
          .from('theaters')
          .select('id, name, name_he, profile_image_url, description, description_he, website, phone, email, address, location')
          .eq('id', theaterId)
          .single(),
        supabase
          .from('theater_stories')
          .select('id, image_url, caption, expires_at, created_at')
          .eq('theater_id', theaterId)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false }),
      ]);

      if (!theaterRes.error && theaterRes.data) {
        const d = theaterRes.data;
        setTheater({
          id: d.id,
          name: d.name,
          nameHe: d.name_he ?? d.name,
          profileImageUrl: d.profile_image_url ?? null,
          description: d.description ?? '',
          descriptionHe: d.description_he ?? '',
          website: d.website ?? '',
          phone: d.phone ?? '',
          email: d.email ?? '',
          address: d.address ?? '',
          location: d.location ?? '',
        });
      }

      if (!storiesRes.error && storiesRes.data) {
        setStories(storiesRes.data.map(s => ({
          id: s.id,
          imageUrl: s.image_url,
          caption: s.caption,
          expiresAt: s.expires_at,
          createdAt: s.created_at,
        })));
      }
    } finally {
      setLoading(false);
    }
  }, [theaterId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { theater, stories, loading, refresh };
}
