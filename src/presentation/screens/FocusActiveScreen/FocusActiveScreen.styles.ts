import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xl,
    },
    phaseLabel: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    cycleIndicator: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
      alignItems: 'center',
    },
    cycleDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    timer: {
      fontSize: 72,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      letterSpacing: 2,
    },
    timerBreak: {
      color: theme.colors.success,
    },
    actions: {
      gap: theme.spacing.sm,
      width: '100%',
    },
  });
}
