import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    permissionsCard: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    permissionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    permissionInfo: {
      flex: 1,
      gap: 2,
    },
    searchRow: {
      marginBottom: theme.spacing.sm,
    },
    filtersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    listContainer: {
      maxHeight: 360,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    list: {
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
    },
    appRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: theme.colors.surface,
    },
    appRowSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.surfaceMuted,
    },
    appIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.sm,
    },
    appIconPlaceholder: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    appInfo: {
      flex: 1,
      gap: 2,
    },
    footer: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    inlineError: {
      marginVertical: theme.spacing.sm,
    },
  });
}
