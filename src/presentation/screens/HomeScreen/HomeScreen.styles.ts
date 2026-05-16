import { StyleSheet } from 'react-native';
import type { Theme } from '@/presentation/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    avatarWrapper: {
      position: 'relative',
    },
    levelBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      paddingHorizontal: 4,
      backgroundColor: theme.colors.accent,
      borderWidth: 2,
      borderColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsCard: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionHeader: {
      marginBottom: theme.spacing.md,
    },
    sortRow: {
      marginBottom: theme.spacing.md,
    },
    list: {
      gap: theme.spacing.sm,
    },
  });
