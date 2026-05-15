/**
 * Opções de customização visual disponíveis ao usuário.
 *
 * Princípio: o usuário deve poder ajustar o app à sua preferência sensorial
 * (especialmente útil para TDAH — sobreposição visual e estímulos variam por pessoa).
 */

export type AccentPreset =
  | 'indigo'
  | 'blue'
  | 'teal'
  | 'green'
  | 'amber'
  | 'pink'
  | 'purple';

export interface AccentColorSet {
  base: string;
  pressed: string;
}

export const accentPresets: Record<AccentPreset, { light: AccentColorSet; dark: AccentColorSet }> = {
  indigo: {
    light: { base: '#4F46E5', pressed: '#4338CA' },
    dark: { base: '#818CF8', pressed: '#6366F1' },
  },
  blue: {
    light: { base: '#2563EB', pressed: '#1D4ED8' },
    dark: { base: '#60A5FA', pressed: '#3B82F6' },
  },
  teal: {
    light: { base: '#0D9488', pressed: '#0F766E' },
    dark: { base: '#5EEAD4', pressed: '#2DD4BF' },
  },
  green: {
    light: { base: '#16A34A', pressed: '#15803D' },
    dark: { base: '#4ADE80', pressed: '#22C55E' },
  },
  amber: {
    light: { base: '#D97706', pressed: '#B45309' },
    dark: { base: '#FBBF24', pressed: '#F59E0B' },
  },
  pink: {
    light: { base: '#DB2777', pressed: '#BE185D' },
    dark: { base: '#F472B6', pressed: '#EC4899' },
  },
  purple: {
    light: { base: '#7C3AED', pressed: '#6D28D9' },
    dark: { base: '#A78BFA', pressed: '#8B5CF6' },
  },
};

export type FontScale = 0.875 | 1.0 | 1.125 | 1.25;

export const fontScales: { label: string; value: FontScale }[] = [
  { label: 'Pequeno', value: 0.875 },
  { label: 'Padrão', value: 1.0 },
  { label: 'Grande', value: 1.125 },
  { label: 'Extra grande', value: 1.25 },
];

export type Density = 'compact' | 'normal' | 'comfortable';

export const densityScales: Record<Density, number> = {
  compact: 0.85,
  normal: 1.0,
  comfortable: 1.2,
};

export interface UserVisualPreferences {
  accent: AccentPreset;
  fontScale: FontScale;
  density: Density;
  reduceMotion: boolean;
}

export const defaultVisualPreferences: UserVisualPreferences = {
  accent: 'indigo',
  fontScale: 1.0,
  density: 'normal',
  reduceMotion: false,
};
