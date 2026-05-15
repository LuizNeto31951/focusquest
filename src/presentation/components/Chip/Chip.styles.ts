import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme, accentColor: string, selected: boolean) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: selected ? accentColor : theme.colors.border,
      backgroundColor: selected ? accentColor : theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      alignSelf: 'flex-start',
    },
  });
}

export function chipTextColor(theme: Theme, accentColor: string, selected: boolean): string {
  if (selected) return theme.colors.textOnAccent;
  return accentColor || theme.colors.textPrimary;
}
