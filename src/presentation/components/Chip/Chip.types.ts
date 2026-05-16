import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';

export interface ChipProps {
  label: string;
  color?: string;
  selected?: boolean;
  icon?: ComponentType<LucideProps>;
  onPress?: () => void;
}
