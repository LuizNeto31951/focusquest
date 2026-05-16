import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    swatchRow: {
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
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    iconCell: {
      width: 48,
      height: 48,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    iconCellActive: {
      borderWidth: 2,
    },
    preview: {
      marginTop: theme.spacing.sm,
      alignItems: 'center',
    },
    previewCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    errorText: {
      marginTop: theme.spacing.sm,
    },
  });
}
