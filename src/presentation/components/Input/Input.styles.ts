import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme, hasError: boolean) {
  return StyleSheet.create({
    wrapper: {
      gap: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: hasError ? theme.colors.danger : theme.colors.border,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      minHeight: 48,
    },
  });
}
