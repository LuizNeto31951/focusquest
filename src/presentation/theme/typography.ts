import type { TextStyle } from 'react-native';

/**
 * Sistema tipográfico.
 *
 * Princípio R31 (TDAH): corpo mínimo de 16px, escalável até ~1.25× via preferências
 * do usuário (aplicado em runtime no buildTheme).
 */

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
}

export interface TypographyScale {
  display: TypographyStyle;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  bodyLarge: TypographyStyle;
  body: TypographyStyle;
  bodyEmphasis: TypographyStyle;
  caption: TypographyStyle;
  label: TypographyStyle;
}

export const typography: TypographyScale = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
  },
  h2: {
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyEmphasis: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
};

export type TypographyVariant = keyof TypographyScale;
