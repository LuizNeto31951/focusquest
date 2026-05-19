import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { resolveColor } from '@/presentation/components/Typography/Typography.styles';
import type { TypographyColor } from '@/presentation/components/Typography';
import type { IconProps } from './Icon.types';

const NAMED_COLORS: ReadonlySet<TypographyColor> = new Set<TypographyColor>([
  'primary',
  'secondary',
  'disabled',
  'accent',
  'success',
  'warning',
  'danger',
  'onAccent',
]);

export function Icon({
  name: Component,
  size = 20,
  color = 'primary',
  strokeWidth = 2,
}: IconProps) {
  const theme = useTheme();
  const resolved =
    typeof color === 'string' && NAMED_COLORS.has(color as TypographyColor)
      ? resolveColor(theme, color as TypographyColor)
      : (color as string);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Component size={size} color={resolved} strokeWidth={strokeWidth} />
    </View>
  );
}
