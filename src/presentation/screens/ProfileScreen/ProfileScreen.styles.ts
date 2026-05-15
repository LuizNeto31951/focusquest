import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    swatch: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.pill,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    swatchActive: {
      borderColor: theme.colors.textPrimary,
      borderWidth: 3,
    },
    statsCard: {
      gap: theme.spacing.xs,
    },
  });
}
