import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
    accentRow: {
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
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    welcomeCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.xl,
    },
  });
