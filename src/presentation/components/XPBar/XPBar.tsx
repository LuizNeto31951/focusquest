import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
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
  const clamped = Math.min(1, Math.max(0, progress));

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
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
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
