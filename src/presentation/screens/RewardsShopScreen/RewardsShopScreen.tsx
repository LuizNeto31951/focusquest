import React, { useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Gift, History, PartyPopper } from 'lucide-react-native';
import {
  Button,
  Card,
  Chip,
  CoinBadge,
  EmptyState,
  Icon,
  RewardCard,
  Screen,
  Typography,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ShopStackParamList } from '@/presentation/navigation/types';
import { useRewardsShopScreen } from './useRewardsShopScreen';
import { createStyles } from './RewardsShopScreen.styles';

export function RewardsShopScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ShopStackParamList>>();
  const vm = useRewardsShopScreen();

  function confirmRedeem(name: string, cost: number, onConfirm: () => void) {
    Alert.alert(
      'Resgatar recompensa',
      `Trocar ${cost} moedas por "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resgatar', style: 'default', onPress: onConfirm },
      ],
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Typography variant="h2">Lojinha</Typography>
          <CoinBadge amount={vm.coins} size="lg" variant="solid" />
        </View>
        <Typography variant="body" color="secondary">
          Troque suas moedas por recompensas reais
        </Typography>
        {vm.stats ? (
          <View style={styles.statsRow}>
            <Typography variant="caption" color="secondary">
              Resgates: {vm.stats.totalRedemptions}
            </Typography>
            <Typography variant="caption" color="secondary">
              Investido: {vm.stats.totalSpent} moedas
            </Typography>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionItem}>
          <Button
            label="Nova recompensa"
            variant="primary"
            fullWidth
            onPress={() => navigation.navigate('RewardEditor', {})}
          />
        </View>
        <View style={styles.actionItem}>
          <Button
            label="Histórico"
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('Redemptions')}
          />
        </View>
      </View>

      {vm.lastRedeemed ? (
        <Pressable
          onPress={vm.dismissLastRedeemed}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          style={styles.successBanner}
        >
          <Icon name={PartyPopper} size={20} color={theme.colors.accent} />
          <Typography
            variant="bodyEmphasis"
            style={styles.successText}
          >
            Aproveite: {vm.lastRedeemed.name}!
          </Typography>
        </Pressable>
      ) : null}

      {vm.redeemError ? (
        <View style={styles.errorBanner}>
          <Typography variant="caption" color="danger">
            {vm.redeemError.message}
          </Typography>
        </View>
      ) : null}

      {vm.categories.length > 1 ? (
        <View style={styles.filtersRow}>
          <Chip
            label="Todas"
            selected={vm.activeCategory === null}
            onPress={() => vm.setActiveCategory(null)}
          />
          {vm.categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={vm.activeCategory === cat}
              onPress={() => vm.setActiveCategory(cat)}
            />
          ))}
        </View>
      ) : null}

      {vm.allRewards.length === 0 ? (
        <Card>
          <EmptyState
            icon={Gift}
            title="Sua lojinha está vazia"
            description="Crie sua primeira recompensa e comece a se incentivar."
          />
          <Button
            label="Criar recompensa"
            variant="primary"
            fullWidth
            onPress={() => navigation.navigate('RewardEditor', {})}
          />
        </Card>
      ) : vm.rewards.length === 0 ? (
        <EmptyState
          icon={History}
          title="Nada nesta categoria"
          description="Tente outra categoria ou crie uma nova recompensa."
        />
      ) : (
        <View style={styles.list}>
          {vm.rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              affordable={vm.coins >= reward.cost}
              redeeming={vm.redeeming}
              onRedeem={() =>
                confirmRedeem(reward.name, reward.cost, async () => {
                  try {
                    await vm.onRedeem(reward);
                  } catch (err) {
                    Alert.alert(
                      'Não foi possível resgatar',
                      (err as Error).message,
                    );
                  }
                })
              }
              onEdit={() =>
                navigation.navigate('RewardEditor', { rewardId: reward.id })
              }
              onToggleFavorite={() => vm.onToggleFavorite(reward)}
            />
          ))}
        </View>
      )}

      {vm.allRewards.length > 0 ? (
        <View style={{ marginTop: theme.spacing.lg }}>
          <Button
            label="Adicionar recompensa"
            variant="ghost"
            fullWidth
            onPress={() => navigation.navigate('RewardEditor', {})}
          />
        </View>
      ) : null}
    </Screen>
  );
}
