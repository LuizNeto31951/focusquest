import { useCallback } from 'react';
import {
  useCurrentUser,
  useUserStats,
  useSkipDay,
  useWeeklyStats,
} from '@/presentation/hooks';
import {
  useThemeMode,
  useThemePreferences,
} from '@/presentation/providers';
import type { AccentPreset, Density, FontScale } from '@/presentation/theme';

export function useProfileScreen() {
  const { user } = useCurrentUser();
  const { stats } = useUserStats(user?.id);
  const { stats: weeklyStats } = useWeeklyStats(user?.id);
  const skipDay = useSkipDay();
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

  const triggerSkipDay = useCallback(async () => {
    if (!user) return;
    await skipDay.run({ userId: user.id });
  }, [user, skipDay]);

  return {
    user,
    stats,
    weeklyStats,
    mode,
    preferences,
    toggleMode,
    setAccent,
    setFontScale,
    setDensity,
    toggleReduceMotion,
    resetPreferences,
    triggerSkipDay,
    skipDayLoading: skipDay.loading,
  };
}
