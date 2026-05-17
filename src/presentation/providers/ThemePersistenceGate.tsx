import { useEffect, useRef } from 'react';
import {
  accentPresets,
  defaultVisualPreferences,
  fontScales,
  type AccentPreset,
  type Density,
  type FontScale,
} from '@/presentation/theme';
import type {
  DensityPreference,
  ThemeModePreference,
} from '@/domain/entities';
import { useUserStore } from '@/presentation/stores';
import { useAppDependencies } from './AppDependenciesProvider';
import { useThemeMode, useThemePreferences } from './ThemeProvider';

const VALID_ACCENTS = Object.keys(accentPresets) as AccentPreset[];
const VALID_FONT_SCALES: readonly FontScale[] = fontScales.map((f) => f.value);
const VALID_DENSITIES: Density[] = ['compact', 'normal', 'comfortable'];

function coerceAccent(value: string): AccentPreset {
  return (VALID_ACCENTS as string[]).includes(value)
    ? (value as AccentPreset)
    : defaultVisualPreferences.accent;
}

function coerceFontScale(value: number): FontScale {
  return (VALID_FONT_SCALES as number[]).includes(value)
    ? (value as FontScale)
    : defaultVisualPreferences.fontScale;
}

function coerceDensity(value: DensityPreference): Density {
  return (VALID_DENSITIES as string[]).includes(value)
    ? (value as Density)
    : defaultVisualPreferences.density;
}

/**
 * Carrega preferências de tema do banco quando o usuário fica disponível e
 * salva qualquer mudança subsequente. Não renderiza nada.
 */
export function ThemePersistenceGate() {
  const { getUserPreferences, saveUserPreferences } = useAppDependencies();
  const user = useUserStore((s) => s.user);
  const { mode, setMode } = useThemeMode();
  const { preferences, updatePreferences } = useThemePreferences();
  const loadedRef = useRef(false);

  // 1) Carrega do banco quando o usuário aparece (uma vez por sessão).
  useEffect(() => {
    if (!user || loadedRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const stored = await getUserPreferences.execute({ userId: user.id });
        if (cancelled) return;
        if (stored) {
          setMode(stored.mode as ThemeModePreference);
          updatePreferences({
            accent: coerceAccent(stored.accent),
            fontScale: coerceFontScale(stored.fontScale),
            density: coerceDensity(stored.density),
            reduceMotion: stored.reduceMotion,
          });
        }
      } catch {
        // primeira execução ou tabela vazia — usa defaults
      } finally {
        loadedRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, getUserPreferences, setMode, updatePreferences]);

  // 2) Salva no banco quando o modo ou as preferências mudarem (após carga inicial).
  useEffect(() => {
    if (!user || !loadedRef.current) return;
    saveUserPreferences
      .execute({
        userId: user.id,
        mode,
        accent: preferences.accent,
        fontScale: preferences.fontScale,
        density: preferences.density,
        reduceMotion: preferences.reduceMotion,
      })
      .catch(() => undefined);
  }, [user, mode, preferences, saveUserPreferences]);

  return null;
}
