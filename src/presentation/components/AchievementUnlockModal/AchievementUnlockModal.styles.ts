import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xl,
      padding: theme.spacing.xxl,
      alignItems: 'center',
      gap: theme.spacing.md,
      width: '100%',
      maxWidth: 360,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconWrapper: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    actions: {
      width: '100%',
      marginTop: theme.spacing.md,
    },
    counter: {
      marginTop: theme.spacing.xs,
    },
  });
}
