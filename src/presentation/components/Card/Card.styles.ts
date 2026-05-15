import { StyleSheet } from 'react-native';
import type { Theme, SpacingToken } from '@/presentation/theme';

export function createStyles(
  theme: Theme,
  padding: SpacingToken,
  variant: 'surface' | 'muted',
) {
  return StyleSheet.create({
    container: {
      backgroundColor:
        variant === 'muted' ? theme.colors.surfaceMuted : theme.colors.surface,
      borderRadius: theme.radii.lg,
      padding: theme.spacing[padding],
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });
}
