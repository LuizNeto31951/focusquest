import { StyleSheet } from 'react-native';
import type { Theme, SpacingToken } from '@/presentation/theme';

export const createStyles = (theme: Theme, paddingToken: SpacingToken) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing[paddingToken],
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing[paddingToken],
    },
  });
