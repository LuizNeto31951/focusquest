import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Coins } from 'lucide-react-native';
import { Icon } from '@/presentation/components/Icon';
import { Typography } from '@/presentation/components/Typography';
import { useTheme } from '@/presentation/providers';

export interface CoinBadgeProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'soft' | 'solid' | 'plain';
  style?: ViewStyle;
}

export function CoinBadge({
  amount,
  size = 'md',
  variant = 'soft',
  style,
}: CoinBadgeProps) {
  const theme = useTheme();
  const sizes = {
    sm: { icon: 14, padV: 2, padH: 8, gap: 4 },
    md: { icon: 18, padV: 4, padH: 10, gap: 6 },
    lg: { icon: 22, padV: 6, padH: 14, gap: 8 },
  } as const;
  const cfg = sizes[size];

  const colors =
    variant === 'solid'
      ? {
          bg: theme.colors.xp,
          fg: theme.colors.textOnAccent,
          icon: theme.colors.textOnAccent,
        }
      : variant === 'soft'
        ? {
            bg: theme.colors.surfaceMuted,
            fg: theme.colors.textPrimary,
            icon: theme.colors.xp,
          }
        : {
            bg: 'transparent' as const,
            fg: theme.colors.textPrimary,
            icon: theme.colors.xp,
          };

  const textVariant = size === 'lg' ? 'h3' : size === 'md' ? 'bodyEmphasis' : 'label';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: cfg.gap,
          paddingVertical: cfg.padV,
          paddingHorizontal: cfg.padH,
          borderRadius: 999,
          backgroundColor: colors.bg,
        },
        style,
      ]}
      accessibilityLabel={`${amount} moedas`}
    >
      <Icon name={Coins} size={cfg.icon} color={colors.icon} />
      <Typography
        variant={textVariant}
        style={{ color: colors.fg, fontWeight: '700' }}
      >
        {amount}
      </Typography>
    </View>
  );
}
