import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    actionItem: {
      flex: 1,
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    list: {
      gap: theme.spacing.md,
    },
    successBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surfaceMuted,
      marginBottom: theme.spacing.md,
    },
    successText: {
      flex: 1,
    },
    errorBanner: {
      padding: theme.spacing.sm,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.surfaceMuted,
      marginBottom: theme.spacing.md,
    },
  });
}
