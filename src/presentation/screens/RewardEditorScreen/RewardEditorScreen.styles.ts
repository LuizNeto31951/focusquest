import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    preview: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    previewCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImage: {
      width: 96,
      height: 96,
      borderRadius: theme.radii.md,
    },
    imageActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    section: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    swatchRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    swatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    swatchActive: {
      borderColor: theme.colors.textPrimary,
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
    actions: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    errorText: {
      marginTop: theme.spacing.sm,
    },
  });
}
