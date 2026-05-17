import type { ISODate, UniqueId } from '@/shared/types';

export type ThemeModePreference = 'light' | 'dark';
export type DensityPreference = 'compact' | 'normal' | 'comfortable';

export interface UserPreferences {
  readonly userId: UniqueId;
  readonly mode: ThemeModePreference;
  readonly accent: string;
  readonly fontScale: number;
  readonly density: DensityPreference;
  readonly reduceMotion: boolean;
  readonly updatedAt: ISODate;
}

export interface CreateUserPreferencesProps {
  userId: UniqueId;
  mode: ThemeModePreference;
  accent: string;
  fontScale: number;
  density: DensityPreference;
  reduceMotion: boolean;
  now: ISODate;
}

export function createUserPreferences(
  props: CreateUserPreferencesProps,
): UserPreferences {
  return {
    userId: props.userId,
    mode: props.mode,
    accent: props.accent,
    fontScale: props.fontScale,
    density: props.density,
    reduceMotion: props.reduceMotion,
    updatedAt: props.now,
  };
}
