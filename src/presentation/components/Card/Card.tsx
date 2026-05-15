import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card({
  padding = 'lg',
  variant = 'surface',
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();
  const styles = useMemo(
    () => createStyles(theme, padding, variant),
    [theme, padding, variant],
  );
  return (
    <View {...rest} style={[styles.container, style]}>
      {children}
    </View>
  );
}
