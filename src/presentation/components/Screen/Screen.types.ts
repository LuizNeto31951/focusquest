import type { ViewProps, ScrollViewProps } from 'react-native';
import type { SpacingToken } from '@/presentation/theme';

export interface ScreenProps extends ViewProps {
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  padding?: SpacingToken;
  children: React.ReactNode;
}
