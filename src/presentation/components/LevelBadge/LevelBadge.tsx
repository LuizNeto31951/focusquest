import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';

interface LevelBadgeProps {
  level: number;
  size?: number;
}

export function LevelBadge({ level, size = 48 }: LevelBadgeProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);
  const reduceMotion = theme.preferences.reduceMotion;

  const scale = useSharedValue(1);
  const previousLevel = useRef(level);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      previousLevel.current = level;
      return;
    }
    if (level > previousLevel.current && !reduceMotion) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 180 }),
        withSpring(1, { damping: 6, stiffness: 180 }),
      );
    }
    previousLevel.current = level;
  }, [level, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.badge, animatedStyle]}>
      <Typography variant="h3" style={{ color: theme.colors.textOnAccent }}>
        {level}
      </Typography>
    </Animated.View>
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
