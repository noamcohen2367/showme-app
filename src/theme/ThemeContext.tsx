// ============================================
// ShowME App - Theme Context & Provider
// ============================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Theme, lightTheme, darkTheme } from './theme';

// ============================================
// Types
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
}

// ============================================
// Storage key
// ============================================

const STORAGE_KEY = '@showmi/theme_mode';

// ============================================
// Helpers
// ============================================

function resolveTheme(mode: ThemeMode, systemScheme: ColorSchemeName): Theme {
  if (mode === 'light') return lightTheme;
  if (mode === 'dark') return darkTheme;
  return systemScheme === 'light' ? lightTheme : darkTheme;
}

// ============================================
// Context
// ============================================

const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  mode: 'dark',
  isDark: true,
  setMode: async () => {},
});

// ============================================
// Provider
// ============================================

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [ready, setReady] = useState(false);

  // Load persisted mode on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
      setReady(true);
    });
  }, []);

  // Listen to OS appearance changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const theme = resolveTheme(mode, systemScheme);
  const isDark = theme === darkTheme;

  // Avoid flash: render nothing until mode is loaded from storage
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
