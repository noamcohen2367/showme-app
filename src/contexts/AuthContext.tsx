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
import { getAuth, clearAuth } from '../storage/mvpStorage';

interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // AsyncStorage check is fast (<50ms) and completes well before the
    // splash screen dismisses (~800ms), so no flicker is visible.
    getAuth().then((auth) => {
      if (auth.isLoggedIn) setIsLoggedIn(true);
    });
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    await clearAuth();
    setIsLoggedIn(false);
  };

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
