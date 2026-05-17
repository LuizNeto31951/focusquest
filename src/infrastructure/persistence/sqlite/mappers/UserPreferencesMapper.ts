import { UniqueId, ISODate } from '@/shared/types';
import type {
  DensityPreference,
  ThemeModePreference,
  UserPreferences,
} from '@/domain/entities';

export interface UserPreferencesRow {
  user_id: string;
  mode: string;
  accent: string;
  font_scale: number;
  density: string;
  reduce_motion: number;
  updated_at: string;
}

const VALID_MODES: ThemeModePreference[] = ['light', 'dark'];
const VALID_DENSITIES: DensityPreference[] = ['compact', 'normal', 'comfortable'];

function coerceMode(value: string): ThemeModePreference {
  return (VALID_MODES as string[]).includes(value)
    ? (value as ThemeModePreference)
    : 'light';
}

function coerceDensity(value: string): DensityPreference {
  return (VALID_DENSITIES as string[]).includes(value)
    ? (value as DensityPreference)
    : 'normal';
}

export const UserPreferencesMapper = {
  toRow(prefs: UserPreferences): UserPreferencesRow {
    return {
      user_id: prefs.userId,
      mode: prefs.mode,
      accent: prefs.accent,
      font_scale: prefs.fontScale,
      density: prefs.density,
      reduce_motion: prefs.reduceMotion ? 1 : 0,
      updated_at: prefs.updatedAt,
    };
  },

  toDomain(row: UserPreferencesRow): UserPreferences {
    return {
      userId: UniqueId.from(row.user_id),
      mode: coerceMode(row.mode),
      accent: row.accent,
      fontScale: Number.isFinite(row.font_scale) ? row.font_scale : 1.0,
      density: coerceDensity(row.density),
      reduceMotion: Boolean(row.reduce_motion),
      updatedAt: ISODate.from(row.updated_at),
    };
  },
};
