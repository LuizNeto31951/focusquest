import React, { useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Award } from 'lucide-react-native';
import { Button, Icon, Typography } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useFeedbackStore } from '@/presentation/stores';
import { createStyles } from './AchievementUnlockModal.styles';

export function AchievementUnlockModal() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const achievements = useFeedbackStore((s) => s.pendingAchievements);
  const pop = useFeedbackStore((s) => s.popAchievement);

  const current = achievements[0];
  const remaining = achievements.length;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (current) {
      opacity.value = withTiming(1, { duration: 220 });
      scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    } else {
      opacity.value = withTiming(0, { duration: 160 });
      scale.value = withTiming(0.85, { duration: 160 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.code]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!current) return null;

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        onPress={pop}
        style={styles.backdrop}
      />
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.iconWrapper}>
          <Icon name={Award} size={44} color={theme.colors.textOnAccent} />
        </View>
        <Typography variant="label" color="secondary">
          Conquista desbloqueada
        </Typography>
        <Typography variant="h2" align="center">
          {current.name}
        </Typography>
        <Typography variant="body" color="secondary" align="center">
          {current.description}
        </Typography>
        {remaining > 1 ? (
          <Typography
            variant="caption"
            color="secondary"
            align="center"
            style={styles.counter}
          >
            +{remaining - 1} para ver
          </Typography>
        ) : null}
        <View style={styles.actions}>
          <Button
            label={remaining > 1 ? 'Próxima' : 'Legal'}
            fullWidth
            onPress={pop}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
