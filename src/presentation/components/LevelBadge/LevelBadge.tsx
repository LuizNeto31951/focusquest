import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';

interface LevelBadgeProps {
  level: number;
  size?: number;
}

export function LevelBadge({ level, size = 48 }: LevelBadgeProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);
  return (
    <View style={styles.badge}>
      <Typography variant="h3" style={{ color: theme.colors.textOnAccent }}>
        {level}
      </Typography>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>, size: number) {
  return StyleSheet.create({
    badge: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
