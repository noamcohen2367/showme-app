// ============================================
// ShowME App - Theater Service
// Upload helpers for theater profile image & stories
// ============================================

import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../lib/supabase';

const BUCKET = 'theater-media';

// ─── Shared helpers ────────────────────────────────────────────────────────

async function uriToBytes(uri: string): Promise<Uint8Array> {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getPublicUrl(path: string): string {
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

// ─── Theater profile image ─────────────────────────────────────────────────

export async function uploadTheaterProfileImage(
  theaterId: string,
  uri: string,
): Promise<string> {
  const bytes = await uriToBytes(uri);
  const path = `${theaterId}/profile.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });

  if (error) throw error;

  // Cache-bust so expo-image picks up the new image immediately
  const url = `${getPublicUrl(path)}?t=${Date.now()}`;
  const { error: dbError } = await supabase
    .from('theaters')
    .update({ profile_image_url: url })
    .eq('id', theaterId);

  if (dbError) throw dbError;
  return url;
}

// ─── Theater stories ───────────────────────────────────────────────────────

export async function uploadTheaterStory(
  theaterId: string,
  uri: string,
  caption?: string,
): Promise<void> {
  const bytes = await uriToBytes(uri);
  const path = `${theaterId}/stories/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: false });

  if (uploadError) throw uploadError;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { error: dbError } = await supabase.from('theater_stories').insert({
    theater_id: theaterId,
    image_url: getPublicUrl(path),
    caption: caption?.trim() || null,
    expires_at: expiresAt.toISOString(),
  });

  if (dbError) throw dbError;
}

export async function deleteTheaterStory(
  storyId: string,
  imageUrl: string,
): Promise<void> {
  // Extract storage path from public URL
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = imageUrl.indexOf(marker);
    if (idx !== -1) {
      const storagePath = decodeURIComponent(imageUrl.slice(idx + marker.length).split('?')[0]);
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }
  } catch {
    // Storage delete is best-effort; always delete DB row
  }

  await supabase.from('theater_stories').delete().eq('id', storyId);
}
