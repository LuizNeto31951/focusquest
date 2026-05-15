import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { createStyles, resolveColor } from './Typography.styles';
import type { TypographyProps } from './Typography.types';

export function Typography({
  variant = 'body',
  color = 'primary',
  align = 'auto',
  style,
  children,
  ...rest
}: TypographyProps) {
  const theme = useTheme();
  const styles = useMemo(createStyles, []);
  const variantStyle = theme.typography[variant];
  const textColor = resolveColor(theme, color);

  return (
    <Text
      {...rest}
      style={[styles.base, variantStyle, { color: textColor, textAlign: align }, style]}
    >
      {children}
    </Text>
  );
}
