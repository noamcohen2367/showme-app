// ============================================
// ShowME App - Auth Context
// ============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/types';
import { changeLanguage, LanguageCode } from '../i18n/i18n';

interface AuthContextValue {
  isLoggedIn: boolean;
  profileLoading: boolean;
  userProfile: User | null;
  isTheater: boolean;
  login: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserProfile(authId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, phone, full_name, profile_image_url, level, total_purchases, preferred_location, language, created_at, role, theater_id')
    .eq('id', authId)
    .single();

  if (!data) {
    // PGRST116 = row not found → profile doesn't exist, caller will sign the user out
    if (error?.code === 'PGRST116') return null;
    // Any other DB error (e.g. missing column before migration) — throw so the
    // caller's .catch() fires and does NOT sign the user out.
    throw new Error(error?.message ?? 'Failed to load profile');
  }

  const profile: User = {
    id: data.id,
    email: data.email ?? '',
    phone: data.phone ?? '',
    fullName: data.full_name ?? '',
    profileImageUrl: data.profile_image_url ?? '',
    level: data.level ?? 'bronze',
    totalPurchases: data.total_purchases ?? 0,
    preferredLocation: data.preferred_location,
    language: data.language ?? 'he',
    createdAt: data.created_at ?? '',
    role: data.role ?? 'user',
    theaterId: data.theater_id ?? undefined,
  };

  // Apply the user's saved language (non-blocking)
  if (profile.language && profile.language in { en: 1, he: 1, ru: 1 }) {
    changeLanguage(profile.language as LanguageCode).catch(() => {});
  }

  return profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    // onAuthStateChange callback must be synchronous — never await inside it.
    // Kick off the async profile fetch with .then() so Supabase's internal queue
    // is never blocked. Only re-fetch on INITIAL_SESSION / SIGNED_IN, not on
    // TOKEN_REFRESH (which fires every hour and doesn't need a DB round-trip).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          setProfileLoading(true);
          fetchUserProfile(session.user.id)
            .then(profile => {
              if (!profile) {
                // No profile row — sign out so auth gate redirects to login
                supabase.auth.signOut();
                return;
              }
              setUserProfile(profile);
              setProfileLoading(false);
            })
            .catch(() => setProfileLoading(false));
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(() => setIsLoggedIn(true), []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    setProfileLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const profile = await fetchUserProfile(session.user.id);
      setUserProfile(profile);
    }
  }, []);

  // Memoize context value so consumers don't re-render on unrelated parent renders.
  const isTheater = userProfile?.role === 'theater';

  const value = useMemo<AuthContextValue>(
    () => ({ isLoggedIn, profileLoading, userProfile, isTheater, login, logout, refreshProfile }),
    [isLoggedIn, profileLoading, userProfile, isTheater, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
