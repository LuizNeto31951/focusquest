import React, { useMemo } from 'react';
import { View } from 'react-native';
import { History } from 'lucide-react-native';
import {
  Card,
  CoinBadge,
  EmptyState,
  Screen,
  Typography,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useRedemptionsScreen } from './useRedemptionsScreen';
import { createStyles } from './RedemptionsScreen.styles';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function RedemptionsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useRedemptionsScreen();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Typography variant="h2">Histórico de resgates</Typography>
        <Typography variant="body" color="secondary">
          Sua jornada de auto-recompensa
        </Typography>
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.statItem}>
          <Typography variant="caption" color="secondary">
            Saldo
          </Typography>
          <CoinBadge amount={vm.stats?.coins ?? 0} size="md" variant="solid" />
        </View>
        <View style={styles.statItem}>
          <Typography variant="caption" color="secondary">
            Total de resgates
          </Typography>
          <Typography variant="h3">{vm.stats?.totalRedemptions ?? 0}</Typography>
        </View>
        <View style={styles.statItem}>
          <Typography variant="caption" color="secondary">
            Total investido
          </Typography>
          <Typography variant="h3">{vm.stats?.totalSpent ?? 0}</Typography>
        </View>
      </Card>

      {vm.redemptions.length === 0 ? (
        <EmptyState
          icon={History}
          title="Nenhum resgate ainda"
          description="Conclua tarefas para ganhar moedas e gastá-las na Lojinha."
        />
      ) : (
        <View style={styles.list}>
          {vm.redemptions.map((r) => (
            <Card key={r.id} padding="md">
              <View style={styles.item}>
                <View style={styles.itemMain}>
                  <Typography variant="bodyEmphasis" numberOfLines={1}>
                    {r.rewardName}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {formatDate(r.redeemedAt)}
                  </Typography>
                </View>
                <CoinBadge amount={r.cost} size="sm" variant="soft" />
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
