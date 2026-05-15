import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';
import { useTheme } from '@/presentation/providers';
import { useFeedbackStore, type XPAward } from '@/presentation/stores';
import { createStyles } from './XPToast.styles';

const VISIBLE_DURATION_MS = 2000;
const FADE_DURATION_MS = 250;
const HIDDEN_TRANSLATE_Y = 40;

export function XPToast() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const award = useFeedbackStore((s) => s.pendingXPAward);
  const clear = useFeedbackStore((s) => s.clearXPAward);

  const [displayed, setDisplayed] = useState<XPAward | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(HIDDEN_TRANSLATE_Y);

  useEffect(() => {
    if (!award) return;
    setDisplayed(award);

    opacity.value = withSequence(
      withTiming(1, { duration: FADE_DURATION_MS }),
      withDelay(
        VISIBLE_DURATION_MS,
        withTiming(0, { duration: FADE_DURATION_MS }, (finished) => {
          if (finished) runOnJS(clear)();
        }),
      ),
    );
    translateY.value = withSequence(
      withTiming(0, { duration: FADE_DURATION_MS }),
      withDelay(
        VISIBLE_DURATION_MS,
        withTiming(HIDDEN_TRANSLATE_Y, { duration: FADE_DURATION_MS }),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [award]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!displayed) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <Animated.View style={[styles.pill, animatedStyle]}>
        <Icon name={Sparkles} size={18} color={theme.colors.textOnAccent} />
        <Typography variant="bodyEmphasis" style={{ color: theme.colors.textOnAccent }}>
          +{displayed.amount} XP
        </Typography>
      </Animated.View>
    </View>
  );
}
