// ============================================
// ShowME App - Auth Context
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, clearAuth } from '../storage/mvpStorage';

interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAuth().then(auth => {
      if (auth.isLoggedIn) setIsLoggedIn(true);
    }).finally(() => setReady(true));
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    await clearAuth();
    setIsLoggedIn(false);
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
