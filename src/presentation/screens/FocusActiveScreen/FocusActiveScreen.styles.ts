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
    timer: {
      fontSize: 72,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      letterSpacing: 2,
    },
    actions: {
      gap: theme.spacing.sm,
      width: '100%',
    },
  });
}
