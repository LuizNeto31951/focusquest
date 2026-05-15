import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    headerLeft: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    iconButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    statsCard: {
      gap: theme.spacing.xs,
    },
    chartCard: {
      marginBottom: theme.spacing.sm,
    },
  });
}
