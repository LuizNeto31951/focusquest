import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';
import type { ButtonVariant, ButtonSize } from './Button.types';

interface ResolvedStyles {
  backgroundColor: string;
  pressedBackgroundColor: string;
  borderColor: string;
  textColor: string;
  borderWidth: number;
}

export function resolveVariant(theme: Theme, variant: ButtonVariant): ResolvedStyles {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.accent,
        pressedBackgroundColor: theme.colors.accentPressed,
        borderColor: theme.colors.accent,
        textColor: theme.colors.textOnAccent,
        borderWidth: 0,
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.surface,
        pressedBackgroundColor: theme.colors.surfaceMuted,
        borderColor: theme.colors.border,
        textColor: theme.colors.textPrimary,
        borderWidth: 1,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        pressedBackgroundColor: theme.colors.surfaceMuted,
        borderColor: 'transparent',
        textColor: theme.colors.accent,
        borderWidth: 0,
      };
    case 'danger':
      return {
        backgroundColor: theme.colors.danger,
        pressedBackgroundColor: theme.colors.danger,
        borderColor: theme.colors.danger,
        textColor: theme.colors.textOnAccent,
        borderWidth: 0,
      };
  }
}

const sizeMap = {
  sm: { paddingV: 'sm', paddingH: 'md', minHeight: 36 },
  md: { paddingV: 'md', paddingH: 'lg', minHeight: 44 },
  lg: { paddingV: 'lg', paddingH: 'xl', minHeight: 52 },
} as const;

export function createStyles(theme: Theme, size: ButtonSize, fullWidth: boolean) {
  const dims = sizeMap[size];
  return StyleSheet.create({
    pressable: {
      paddingVertical: theme.spacing[dims.paddingV],
      paddingHorizontal: theme.spacing[dims.paddingH],
      borderRadius: theme.radii.md,
      minHeight: dims.minHeight,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    },
    disabled: {
      opacity: 0.5,
    },
  });
}
