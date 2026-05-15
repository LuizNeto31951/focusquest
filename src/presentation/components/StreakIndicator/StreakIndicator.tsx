import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';

interface StreakIndicatorProps {
  days: number;
}

export function StreakIndicator({ days }: StreakIndicatorProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon name={Flame} size={20} color={theme.colors.warning} />
      <Typography variant="bodyEmphasis">
        {days} {days === 1 ? 'dia' : 'dias'}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
