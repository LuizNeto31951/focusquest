import { useCallback } from 'react';
import { useThemeMode, useThemePreferences } from '@/presentation/providers';
import type { AccentPreset, FontScale, Density } from '@/presentation/theme';

/**
 * ViewModel da HomeScreen.
 *
 * Contém toda a lógica de estado e interação. A View (HomeScreen.tsx) consome
 * este hook e apenas renderiza o que ele expõe — sem nenhuma regra de negócio
 * dentro do JSX.
 */
export function useHomeScreen() {
  const { mode, toggleMode } = useThemeMode();
  const { preferences, updatePreferences, resetPreferences } = useThemePreferences();

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
