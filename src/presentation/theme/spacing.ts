/**
 * Escala de espaçamento baseada em múltiplos de 4px.
 * Usar sempre tokens (theme.spacing.md) em vez de números mágicos.
 */
export interface SpacingScale {
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
}

export const spacing: SpacingScale = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

export type SpacingToken = keyof SpacingScale;
