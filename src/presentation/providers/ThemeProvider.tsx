import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import {
  buildTheme,
  defaultVisualPreferences,
  type Theme,
  type ThemeMode,
  type UserVisualPreferences,
} from '@/presentation/theme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  preferences: UserVisualPreferences;
  updatePreferences: (partial: Partial<UserVisualPreferences>) => void;
  resetPreferences: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialPreferences?: Partial<UserVisualPreferences>;
}

export function ThemeProvider({
  children,
  initialMode,
  initialPreferences,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(
    initialMode ?? (systemScheme === 'dark' ? 'dark' : 'light'),
  );
  const [preferences, setPreferences] = useState<UserVisualPreferences>({
    ...defaultVisualPreferences,
    ...initialPreferences,
  });

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const updatePreferences = useCallback(
    (partial: Partial<UserVisualPreferences>) => {
      setPreferences((current) => ({ ...current, ...partial }));
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaultVisualPreferences);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: buildTheme({ mode, preferences }),
      mode,
      setMode,
      toggleMode,
      preferences,
      updatePreferences,
      resetPreferences,
    }),
    [mode, preferences, toggleMode, updatePreferences, resetPreferences],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('Theme hooks must be used inside a ThemeProvider');
  }
  return ctx;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useThemeMode() {
  const { mode, setMode, toggleMode } = useThemeContext();
  return { mode, setMode, toggleMode };
}

export function useThemePreferences() {
  const { preferences, updatePreferences, resetPreferences } = useThemeContext();
  return { preferences, updatePreferences, resetPreferences };
}
