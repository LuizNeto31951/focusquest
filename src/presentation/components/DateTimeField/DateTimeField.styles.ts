import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme, hasError: boolean) {
  return StyleSheet.create({
    wrapper: {
      gap: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: hasError ? theme.colors.danger : theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    clearButton: {
      padding: theme.spacing.sm,
    },
  });
}
