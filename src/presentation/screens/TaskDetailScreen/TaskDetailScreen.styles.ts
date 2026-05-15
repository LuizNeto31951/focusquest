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
      marginTop: theme.spacing.xl,
    },
    subtasks: {
      gap: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xxxl,
    },
  });
}
