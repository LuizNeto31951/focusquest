import type { ViewProps } from 'react-native';
import type { SpacingToken } from '@/presentation/theme';

export interface CardProps extends ViewProps {
  padding?: SpacingToken;
  variant?: 'surface' | 'muted';
  children: React.ReactNode;
}
