import { lightColors, darkColors } from './colors';
import { spacing as baseSpacing, type SpacingScale } from './spacing';
import { typography as baseTypography, type TypographyScale } from './typography';
import { radii } from './radii';
import {
  accentPresets,
  densityScales,
  defaultVisualPreferences,
  type UserVisualPreferences,
  type FontScale,
  type Density,
} from './customization';
import type { Theme, ThemeMode } from './types';

function applyFontScale(typography: TypographyScale, scale: FontScale): TypographyScale {
  const scaled = {} as TypographyScale;
  (Object.keys(typography) as (keyof TypographyScale)[]).forEach((key) => {
    const v = typography[key];
    scaled[key] = {
      ...v,
      fontSize: Math.round(v.fontSize * scale),
      lineHeight: Math.round(v.lineHeight * scale),
    };
  });
  return scaled;
}

function applyDensity(spacing: SpacingScale, density: Density): SpacingScale {
  const factor = densityScales[density];
  const scaled = {} as SpacingScale;
  (Object.keys(spacing) as (keyof SpacingScale)[]).forEach((key) => {
    scaled[key] = Math.round(spacing[key] * factor);
  });
  return scaled;
}

export interface BuildThemeInput {
  mode: ThemeMode;
  preferences?: Partial<UserVisualPreferences>;
}

export function buildTheme({ mode, preferences }: BuildThemeInput): Theme {
  const prefs: UserVisualPreferences = { ...defaultVisualPreferences, ...preferences };
  const baseColors = mode === 'dark' ? darkColors : lightColors;
  const accentSet = accentPresets[prefs.accent][mode === 'dark' ? 'dark' : 'light'];

  return {
    mode,
    preferences: prefs,
    colors: {
      ...baseColors,
      accent: accentSet.base,
      accentPressed: accentSet.pressed,
    },
    spacing: applyDensity(baseSpacing, prefs.density),
    typography: applyFontScale(baseTypography, prefs.fontScale),
    radii,
  };
}

export type { Theme, ThemeMode } from './types';
export type { ThemeColors } from './colors';
export type { SpacingScale, SpacingToken } from './spacing';
export type { TypographyScale, TypographyVariant } from './typography';
export type { RadiusToken } from './radii';
export type {
  AccentPreset,
  FontScale,
  Density,
  UserVisualPreferences,
} from './customization';
export { accentPresets, fontScales, defaultVisualPreferences } from './customization';
