import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    statsCard: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionHeader: {
      marginBottom: theme.spacing.md,
    },
    list: {
      gap: theme.spacing.sm,
    },
  });
