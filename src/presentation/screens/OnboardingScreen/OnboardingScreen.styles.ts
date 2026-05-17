import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      minHeight: 44,
    },
    scrollContent: {
      flexGrow: 1,
    },
    page: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    iconWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      textAlign: 'center',
    },
    description: {
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    bullets: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
      alignSelf: 'stretch',
    },
    bulletRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'flex-start',
    },
    bulletText: {
      flex: 1,
    },
    permissionsCard: {
      alignSelf: 'stretch',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    permissionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    permissionInfo: {
      flex: 1,
      gap: 2,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
    },
    dotActive: {
      width: 24,
      backgroundColor: theme.colors.accent,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionGrow: {
      flex: 1,
    },
  });
}
