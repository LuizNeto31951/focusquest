import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { chipTextColor, createStyles } from './Chip.styles';
import type { ChipProps } from './Chip.types';

export function Chip({ label, color, selected = false, onPress }: ChipProps) {
  const theme = useTheme();
  const accent = color ?? theme.colors.accent;
  const styles = useMemo(
    () => createStyles(theme, accent, selected),
    [theme, accent, selected],
  );
  const textColor = chipTextColor(theme, accent, selected);

  const content = (
    <View style={styles.container}>
      <Typography variant="label" style={{ color: textColor }}>
        {label}
      </Typography>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}
