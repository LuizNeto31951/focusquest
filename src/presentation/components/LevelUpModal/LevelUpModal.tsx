import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button, Typography } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useFeedbackStore } from '@/presentation/stores';
import { createStyles } from './LevelUpModal.styles';

export function LevelUpModal() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const event = useFeedbackStore((s) => s.pendingLevelUp);
  const clear = useFeedbackStore((s) => s.clearLevelUp);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (event) {
      opacity.value = withTiming(1, { duration: 220 });
      scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    } else {
      opacity.value = withTiming(0, { duration: 160 });
      scale.value = withTiming(0.85, { duration: 160 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!event) return null;

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        onPress={clear}
        style={styles.backdrop}
      />
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNumber}>{event.newLevel}</Text>
        </View>
        <Typography variant="h2" align="center">
          Subiu de nível!
        </Typography>
        <Typography variant="body" color="secondary" align="center">
          Você atingiu o nível {event.newLevel}. Continue concluindo tarefas
          para ir mais longe.
        </Typography>
        <View style={styles.actions}>
          <Button label="Continuar" fullWidth onPress={clear} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
