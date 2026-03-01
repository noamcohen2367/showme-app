// ============================================
// ShowME App - MVP Local Storage Utility
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// ──────────────────────────────────────────
// Storage keys
// ──────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH: 'showmi.mvp.auth',
  LANGUAGE: '@showmi_language',          // shared with i18n.ts
  SUBSCRIPTIONS: 'showmi.mvp.subscriptions',
  WATCHLIST: 'showmi.mvp.watchlist',
  WATCHED: 'showmi.mvp.watched',
  LIVE_CHAT: 'showmi.mvp.liveChat',
} as const;

// ──────────────────────────────────────────
// Type definitions
// ──────────────────────────────────────────
export interface Subscription {
  id: string;
  name: string;
  theater: string;
  totalTickets: number;
  remainingTickets: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalAuthState {
  isLoggedIn: boolean;
  identifier: string;
  updatedAt: string;
}

// ──────────────────────────────────────────
// Generic safe helpers
// ──────────────────────────────────────────
async function safeGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function safeSet(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // swallow storage errors
  }
}

async function safeRemove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

// ──────────────────────────────────────────
// Auth
// ──────────────────────────────────────────
const AUTH_DEFAULT: LocalAuthState = { isLoggedIn: false, identifier: '', updatedAt: '' };

export async function getAuth(): Promise<LocalAuthState> {
  const stored = await safeGet<LocalAuthState>(STORAGE_KEYS.AUTH, AUTH_DEFAULT);
  if (typeof stored?.isLoggedIn !== 'boolean') return AUTH_DEFAULT;
  return stored;
}

export async function setAuth(state: LocalAuthState): Promise<void> {
  await safeSet(STORAGE_KEYS.AUTH, state);
}

export async function clearAuth(): Promise<void> {
  await safeRemove(STORAGE_KEYS.AUTH);
}

// ──────────────────────────────────────────
// Subscriptions
// ──────────────────────────────────────────
export async function getSubscriptions(): Promise<Subscription[]> {
  const stored = await safeGet<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    s =>
      typeof s.id === 'string' &&
      typeof s.name === 'string' &&
      typeof s.totalTickets === 'number' &&
      typeof s.remainingTickets === 'number',
  );
}

export async function saveSubscriptions(subs: Subscription[]): Promise<void> {
  await safeSet(STORAGE_KEYS.SUBSCRIPTIONS, subs);
}

// ──────────────────────────────────────────
// Watchlist (show IDs)
// ──────────────────────────────────────────
export async function getWatchlist(): Promise<string[]> {
  const stored = await safeGet<string[]>(STORAGE_KEYS.WATCHLIST, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(id => typeof id === 'string');
}

export async function saveWatchlist(ids: string[]): Promise<void> {
  await safeSet(STORAGE_KEYS.WATCHLIST, ids);
}

// ──────────────────────────────────────────
// Watched (show IDs marked as watched)
// ──────────────────────────────────────────
export async function getWatched(): Promise<string[]> {
  const stored = await safeGet<string[]>(STORAGE_KEYS.WATCHED, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(id => typeof id === 'string');
}

export async function saveWatched(ids: string[]): Promise<void> {
  await safeSet(STORAGE_KEYS.WATCHED, ids);
}
