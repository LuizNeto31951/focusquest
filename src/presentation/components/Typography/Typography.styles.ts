import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';
import type { TypographyColor } from './Typography.types';

export function resolveColor(theme: Theme, color: TypographyColor): string {
  switch (color) {
    case 'primary':
      return theme.colors.textPrimary;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'disabled':
      return theme.colors.textDisabled;
    case 'accent':
      return theme.colors.accent;
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'danger':
      return theme.colors.danger;
    case 'onAccent':
      return theme.colors.textOnAccent;
  }
}

export const createStyles = () =>
  StyleSheet.create({
    base: {
      includeFontPadding: false,
    },
  });
