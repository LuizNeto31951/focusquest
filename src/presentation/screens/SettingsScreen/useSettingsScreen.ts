import { useCallback } from 'react';
import {
  useThemeMode,
  useThemePreferences,
} from '@/presentation/providers';
import type { AccentPreset, Density, FontScale } from '@/presentation/theme';

export function useSettingsScreen() {
  const { mode, toggleMode } = useThemeMode();
  const { preferences, updatePreferences, resetPreferences } =
    useThemePreferences();

  const setAccent = useCallback(
    (accent: AccentPreset) => updatePreferences({ accent }),
    [updatePreferences],
  );

  const setFontScale = useCallback(
    (fontScale: FontScale) => updatePreferences({ fontScale }),
    [updatePreferences],
  );

  const setDensity = useCallback(
    (density: Density) => updatePreferences({ density }),
    [updatePreferences],
  );

  const toggleReduceMotion = useCallback(
    () => updatePreferences({ reduceMotion: !preferences.reduceMotion }),
    [updatePreferences, preferences.reduceMotion],
  );

  return {
    mode,
    preferences,
    toggleMode,
    setAccent,
    setFontScale,
    setDensity,
    toggleReduceMotion,
    resetPreferences,
  };
}
