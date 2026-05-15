import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Settings } from 'lucide-react-native';
import {
  Screen,
  Typography,
  Card,
  Button,
  XPBar,
  StreakIndicator,
  WeeklyChart,
  Icon,
  type WeeklyChartDataPoint,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ProfileStackParamList } from '@/presentation/navigation/types';
import { useProfileScreen } from './useProfileScreen';
import { createStyles } from './ProfileScreen.styles';

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function buildPoints(
  values: readonly { day: string; value: number }[],
  todayKey: string,
): WeeklyChartDataPoint[] {
  return values.map((entry) => {
    const date = new Date(entry.day);
    return {
      label: WEEKDAY_SHORT[date.getDay()] ?? '',
      value: entry.value,
      highlight: entry.day.slice(0, 10) === todayKey,
    };
  });
}

export function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const vm = useProfileScreen();
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const xpPoints = useMemo(
    () =>
      vm.weeklyStats
        ? buildPoints(
            vm.weeklyStats.days.map((d) => ({ day: d.day, value: d.xpGained })),
            todayKey,
          )
        : [],
    [vm.weeklyStats, todayKey],
  );

  const taskPoints = useMemo(
    () =>
      vm.weeklyStats
        ? buildPoints(
            vm.weeklyStats.days.map((d) => ({
              day: d.day,
              value: d.tasksCompleted,
            })),
            todayKey,
          )
        : [],
    [vm.weeklyStats, todayKey],
  );

  const focusPoints = useMemo(
    () =>
      vm.weeklyStats
        ? buildPoints(
            vm.weeklyStats.days.map((d) => ({
              day: d.day,
              value: d.focusMinutes,
            })),
            todayKey,
          )
        : [],
    [vm.weeklyStats, todayKey],
  );

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Typography variant="h2">{vm.user?.name ?? 'Perfil'}</Typography>
          {vm.stats ? (
            <StreakIndicator days={vm.stats.currentStreakDays} />
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          onPress={() => navigation.navigate('Settings')}
          style={styles.iconButton}
          hitSlop={8}
        >
          <Icon name={Settings} size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      {vm.stats ? (
        <Card style={styles.section}>
          <View style={styles.statsCard}>
            <XPBar
              level={vm.stats.level}
              progress={vm.stats.progressInCurrentLevel}
              xpRemaining={vm.stats.xpRemainingToNextLevel}
            />
            <Typography variant="caption" color="secondary">
              XP total: {vm.stats.totalXP}
            </Typography>
            <Typography variant="caption" color="secondary">
              Maior sequência: {vm.stats.longestStreakDays} dias
            </Typography>
          </View>
        </Card>
      ) : null}

      {vm.weeklyStats ? (
        <View style={styles.section}>
          <Typography variant="h3">Esta semana</Typography>
          <Card style={styles.chartCard}>
            <WeeklyChart
              title="XP por dia"
              total={`${vm.weeklyStats.totalXP} XP`}
              data={xpPoints}
              color={theme.colors.accent}
            />
          </Card>
          <Card style={styles.chartCard}>
            <WeeklyChart
              title="Tarefas concluídas"
              total={`${vm.weeklyStats.totalTasks} no total`}
              data={taskPoints}
              color={theme.colors.success}
            />
          </Card>
          <Card style={styles.chartCard}>
            <WeeklyChart
              title="Minutos em foco"
              total={`${vm.weeklyStats.totalFocusMinutes} min`}
              data={focusPoints}
              color={theme.colors.warning}
              unit="m"
            />
          </Card>
        </View>
      ) : null}

      <View style={styles.section}>
        <Typography variant="h3">Dia Difícil</Typography>
        <Typography variant="body" color="secondary">
          Preserve seu streak por hoje sem precisar concluir tarefas.
        </Typography>
        <Button
          label="Acionar Dia Difícil"
          variant="secondary"
          loading={vm.skipDayLoading}
          onPress={vm.triggerSkipDay}
        />
      </View>
    </Screen>
  );
}
