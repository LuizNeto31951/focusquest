import type { ThemeColors } from './colors';
import type { SpacingScale } from './spacing';
import type { TypographyScale } from './typography';
import type { radii } from './radii';
import type { UserVisualPreferences } from './customization';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  preferences: UserVisualPreferences;
  colors: ThemeColors;
  spacing: SpacingScale;
  typography: TypographyScale;
  radii: typeof radii;
}
