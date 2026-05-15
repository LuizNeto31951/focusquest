import React, { useMemo } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { createStyles } from './Input.styles';
import type { InputProps } from './Input.types';

export function Input({
  label,
  helperText,
  errorText,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const hasError = Boolean(errorText);
  const styles = useMemo(() => createStyles(theme, hasError), [theme, hasError]);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography variant="label" color="secondary">
          {label}
        </Typography>
      ) : null}
      <TextInput
        {...rest}
        style={styles.input}
        placeholderTextColor={theme.colors.textDisabled}
      />
      {errorText ? (
        <Typography variant="caption" color="danger">
          {errorText}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" color="secondary">
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
}
