// ============================================
// ShowME App - Auth Context
// ============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/types';
import { changeLanguage, LanguageCode } from '../i18n/i18n';

interface AuthContextValue {
  isLoggedIn: boolean;
  profileLoading: boolean;
  userProfile: User | null;
  login: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserProfile(authId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('USER')
    .select('id, email, phone, fullName, profileImageUrl, level, totalPurchases, preferredLocation, language, createdAt')
    .eq('id', authId)
    .single();

  if (error || !data) return null;

  const profile: User = {
    id: data.id,
    email: data.email ?? '',
    phone: data.phone ?? '',
    fullName: data.fullName ?? '',
    profileImageUrl: data.profileImageUrl ?? '',
    level: data.level ?? 'bronze',
    totalPurchases: data.totalPurchases ?? 0,
    preferredLocation: data.preferredLocation,
    language: data.language ?? 'en',
    createdAt: data.createdAt ?? '',
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

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    setProfileLoading(false);
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const profile = await fetchUserProfile(session.user.id);
      setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, profileLoading, userProfile, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
