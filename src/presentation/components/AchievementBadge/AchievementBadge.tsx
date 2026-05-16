import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';
import { resolveIcon } from '@/presentation/components/AppIcons';
import type { Achievement } from '@/domain/entities';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, unlocked), [theme, unlocked]);
  const IconComp = resolveIcon(achievement.iconName);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon
          name={unlocked ? IconComp : Lock}
          size={28}
          color={unlocked ? theme.colors.textOnAccent : theme.colors.textDisabled}
        />
      </View>
      <Typography
        variant="label"
        align="center"
        color={unlocked ? 'primary' : 'disabled'}
      >
        {achievement.name}
      </Typography>
      <Typography
        variant="caption"
        align="center"
        color={unlocked ? 'secondary' : 'disabled'}
      >
        {achievement.description}
      </Typography>
      {achievement.isCustom ? (
        <Typography variant="caption" color="accent">
          Personalizada
        </Typography>
      ) : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>, unlocked: boolean) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: 140,
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: unlocked ? theme.colors.accent : theme.colors.surfaceMuted,
      marginBottom: theme.spacing.xs,
    },
  });
}
