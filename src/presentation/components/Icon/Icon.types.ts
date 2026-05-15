import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import type { TypographyColor } from '@/presentation/components/Typography';

export interface IconProps {
  name: ComponentType<LucideProps>;
  size?: number;
  color?: TypographyColor | string;
  strokeWidth?: number;
}
