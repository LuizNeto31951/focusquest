import React, { useMemo } from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { createStyles, resolveVariant } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const resolved = useMemo(() => resolveVariant(theme, variant), [theme, variant]);
  const styles = useMemo(
    () => createStyles(theme, size, fullWidth),
    [theme, size, fullWidth],
  );

  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        {
          backgroundColor: pressed ? resolved.pressedBackgroundColor : resolved.backgroundColor,
          borderColor: resolved.borderColor,
          borderWidth: resolved.borderWidth,
        },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={resolved.textColor} />
      ) : (
        <View>
          <Typography
            variant={size === 'lg' ? 'bodyEmphasis' : 'label'}
            style={{ color: resolved.textColor }}
          >
            {label}
          </Typography>
        </View>
      )}
    </Pressable>
  );
}
