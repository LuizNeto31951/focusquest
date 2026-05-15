import type { TextProps } from 'react-native';
import type { TypographyVariant } from '@/presentation/theme';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'onAccent';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}
