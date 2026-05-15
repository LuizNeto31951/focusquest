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
    levelCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    levelNumber: {
      fontSize: 56,
      fontWeight: '700',
      color: theme.colors.textOnAccent,
    },
    actions: {
      width: '100%',
      marginTop: theme.spacing.md,
    },
  });
}
