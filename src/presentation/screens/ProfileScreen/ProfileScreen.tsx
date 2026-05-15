import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import {
  Screen,
  Typography,
  Card,
  Button,
  XPBar,
  StreakIndicator,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import {
  accentPresets,
  fontScales,
  type AccentPreset,
  type Density,
} from '@/presentation/theme';
import { useProfileScreen } from './useProfileScreen';
import { createStyles } from './ProfileScreen.styles';

const ACCENTS = Object.keys(accentPresets) as AccentPreset[];
const DENSITIES: Density[] = ['compact', 'normal', 'comfortable'];
const DENSITY_LABELS: Record<Density, string> = {
  compact: 'Compacto',
  normal: 'Normal',
  comfortable: 'Confortável',
};

export function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useProfileScreen();

  return (
    <Screen scroll>
      <View style={styles.section}>
        <Typography variant="h2">{vm.user?.name ?? 'Perfil'}</Typography>
        {vm.stats ? (
          <StreakIndicator days={vm.stats.currentStreakDays} />
        ) : null}
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

      <View style={styles.section}>
        <Typography variant="h3">Tema</Typography>
        <Button
          label={vm.mode === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
          variant="secondary"
          onPress={vm.toggleMode}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="h3">Cor de destaque</Typography>
        <View style={styles.row}>
          {ACCENTS.map((accent) => {
            const isActive = vm.preferences.accent === accent;
            const swatchColor =
              accentPresets[accent][vm.mode === 'dark' ? 'dark' : 'light'].base;
            return (
              <Pressable
                key={accent}
                accessibilityRole="button"
                accessibilityLabel={`Cor ${accent}`}
                onPress={() => vm.setAccent(accent)}
                style={[
                  styles.swatch,
                  { backgroundColor: swatchColor },
                  isActive && styles.swatchActive,
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h3">Tamanho do texto</Typography>
        <View style={styles.row}>
          {fontScales.map((scale) => (
            <Button
              key={scale.value}
              label={scale.label}
              size="sm"
              variant={vm.preferences.fontScale === scale.value ? 'primary' : 'secondary'}
              onPress={() => vm.setFontScale(scale.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h3">Densidade</Typography>
        <View style={styles.row}>
          {DENSITIES.map((density) => (
            <Button
              key={density}
              label={DENSITY_LABELS[density]}
              size="sm"
              variant={vm.preferences.density === density ? 'primary' : 'secondary'}
              onPress={() => vm.setDensity(density)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h3">Animações</Typography>
        <Button
          label={vm.preferences.reduceMotion ? 'Reativar animações' : 'Reduzir animações'}
          variant="secondary"
          onPress={vm.toggleReduceMotion}
        />
      </View>

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

      <View style={styles.section}>
        <Button
          label="Restaurar padrões visuais"
          variant="ghost"
          onPress={vm.resetPreferences}
        />
      </View>
    </Screen>
  );
}
