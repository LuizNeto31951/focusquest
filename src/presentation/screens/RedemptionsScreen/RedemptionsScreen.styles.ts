import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    statsCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    list: {
      gap: theme.spacing.sm,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    itemMain: {
      flex: 1,
    },
  });
}
