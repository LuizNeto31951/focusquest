/**
 * Paleta de cores do FocusQuest.
 *
 * Princípios (alinhados com regras TDAH R29):
 * - Apenas 1 cor de destaque (accent) por tela.
 * - Alto contraste WCAG AA mínimo.
 * - Suporte a modo claro/escuro.
 */

const palette = {
  white: '#FFFFFF',
  black: '#000000',

  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A',

  primary500: '#6366F1',
  primary600: '#4F46E5',
  primary700: '#4338CA',

  success500: '#10B981',
  warning500: '#F59E0B',
  danger500: '#EF4444',

  xpGold: '#F59E0B',
};

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnAccent: string;

  accent: string;
  accentPressed: string;

  success: string;
  warning: string;
  danger: string;
  xp: string;
}

export const lightColors: ThemeColors = {
  background: palette.neutral50,
  surface: palette.white,
  surfaceMuted: palette.neutral100,
  border: palette.neutral200,

  textPrimary: palette.neutral900,
  textSecondary: palette.neutral600,
  textDisabled: palette.neutral400,
  textOnAccent: palette.white,

  accent: palette.primary600,
  accentPressed: palette.primary700,

  success: palette.success500,
  warning: palette.warning500,
  danger: palette.danger500,
  xp: palette.xpGold,
};

export const darkColors: ThemeColors = {
  background: palette.neutral900,
  surface: palette.neutral800,
  surfaceMuted: palette.neutral700,
  border: palette.neutral700,

  textPrimary: palette.neutral50,
  textSecondary: palette.neutral300,
  textDisabled: palette.neutral500,
  textOnAccent: palette.white,

  accent: palette.primary500,
  accentPressed: palette.primary600,

  success: palette.success500,
  warning: palette.warning500,
  danger: palette.danger500,
  xp: palette.xpGold,
};
