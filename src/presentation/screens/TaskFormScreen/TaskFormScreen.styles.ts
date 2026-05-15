import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    actions: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    errorText: {
      marginTop: theme.spacing.sm,
    },
  });
}
