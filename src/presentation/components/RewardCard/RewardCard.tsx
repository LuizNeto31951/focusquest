import React, { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Edit2, Star } from 'lucide-react-native';
import type { Reward } from '@/domain/entities';
import { Card } from '@/presentation/components/Card';
import { Icon } from '@/presentation/components/Icon';
import { Typography } from '@/presentation/components/Typography';
import { Button } from '@/presentation/components/Button';
import { CoinBadge } from '@/presentation/components/CoinBadge';
import { resolveIcon } from '@/presentation/components/AppIcons';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './RewardCard.styles';

export interface RewardCardProps {
  reward: Reward;
  affordable: boolean;
  onRedeem?: () => void;
  onEdit?: () => void;
  onToggleFavorite?: () => void;
  redeeming?: boolean;
}

export function RewardCard({
  reward,
  affordable,
  onRedeem,
  onEdit,
  onToggleFavorite,
  redeeming,
}: RewardCardProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const IconComp = resolveIcon(reward.iconKey);

  return (
    <Card padding="md" style={styles.card}>
      <View style={styles.header}>
        {reward.imageUri ? (
          <Image source={{ uri: reward.imageUri }} style={styles.image} />
        ) : (
          <View
            style={[styles.iconBubble, { backgroundColor: reward.color }]}
          >
            <Icon
              name={IconComp}
              size={28}
              color={theme.colors.textOnAccent}
            />
          </View>
        )}
        <View style={styles.titleArea}>
          <View style={styles.titleRow}>
            <Typography
              variant="bodyEmphasis"
              numberOfLines={1}
              style={styles.title}
            >
              {reward.name}
            </Typography>
            {onToggleFavorite ? (
              <Pressable
                onPress={onToggleFavorite}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  reward.isFavorite ? 'Desmarcar favorito' : 'Marcar favorito'
                }
              >
                <Icon
                  name={Star}
                  size={18}
                  color={
                    reward.isFavorite
                      ? theme.colors.xp
                      : theme.colors.textSecondary
                  }
                />
              </Pressable>
            ) : null}
          </View>
          <Typography variant="caption" color="secondary">
            {reward.category}
          </Typography>
        </View>
      </View>

      {reward.description ? (
        <Typography
          variant="caption"
          color="secondary"
          numberOfLines={3}
          style={styles.description}
        >
          {reward.description}
        </Typography>
      ) : null}

      <View style={styles.footer}>
        <CoinBadge amount={reward.cost} size="md" variant="soft" />
        <View style={styles.actions}>
          {onEdit ? (
            <Pressable
              onPress={onEdit}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Editar recompensa"
              style={styles.editButton}
            >
              <Icon
                name={Edit2}
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          ) : null}
          {onRedeem ? (
            <Button
              label={affordable ? 'Resgatar' : 'Sem moedas'}
              size="sm"
              variant={affordable ? 'primary' : 'ghost'}
              disabled={!affordable}
              loading={redeeming}
              onPress={onRedeem}
            />
          ) : null}
        </View>
      </View>
    </Card>
  );
}
