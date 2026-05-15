import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';

interface XPBarProps {
  level: number;
  progress: number;
  xpRemaining: number;
  compact?: boolean;
}

export function XPBar({ level, progress, xpRemaining, compact = false }: XPBarProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const reduceMotion = theme.preferences.reduceMotion;
  const target = Math.min(1, Math.max(0, progress)) * 100;

  const widthPercent = useSharedValue(target);

  useEffect(() => {
    widthPercent.value = reduceMotion
      ? target
      : withTiming(target, {
          duration: 700,
          easing: Easing.out(Easing.cubic),
        });
  }, [target, reduceMotion, widthPercent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthPercent.value}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Typography variant="label" color="secondary">
          Nível {level}
        </Typography>
        {!compact ? (
          <Typography variant="caption" color="secondary">
            {xpRemaining} XP para o próximo
          </Typography>
        ) : null}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    wrapper: {
      gap: theme.spacing.xs,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    track: {
      height: 8,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.pill,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: theme.colors.accent,
    },
  });
}
