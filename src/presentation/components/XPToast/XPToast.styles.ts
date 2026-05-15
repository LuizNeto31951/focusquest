import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      position: 'absolute',
      bottom: theme.spacing.xxl,
      left: 0,
      right: 0,
      alignItems: 'center',
      pointerEvents: 'box-none',
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radii.pill,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
  });
}
