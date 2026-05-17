import type { ViewProps, ScrollViewProps } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import type { SpacingToken } from '@/presentation/theme';

export interface ScreenProps extends ViewProps {
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  padding?: SpacingToken;
  edges?: readonly Edge[];
  children: React.ReactNode;
}
