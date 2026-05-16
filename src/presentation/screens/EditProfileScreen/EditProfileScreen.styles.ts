import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    avatarRow: {
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    saveActions: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    errorText: {
      marginTop: theme.spacing.sm,
    },
  });
}
