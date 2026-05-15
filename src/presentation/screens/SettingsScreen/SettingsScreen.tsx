import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, Typography, Button } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import {
  accentPresets,
  fontScales,
  type AccentPreset,
  type Density,
} from '@/presentation/theme';
import { useSettingsScreen } from './useSettingsScreen';
import { createStyles } from './SettingsScreen.styles';

const ACCENTS = Object.keys(accentPresets) as AccentPreset[];
const DENSITIES: Density[] = ['compact', 'normal', 'comfortable'];
const DENSITY_LABELS: Record<Density, string> = {
  compact: 'Compacto',
  normal: 'Normal',
  comfortable: 'Confortável',
};

export function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useSettingsScreen();

  return (
    <Screen scroll>
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
              variant={
                vm.preferences.fontScale === scale.value ? 'primary' : 'secondary'
              }
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
              variant={
                vm.preferences.density === density ? 'primary' : 'secondary'
              }
              onPress={() => vm.setDensity(density)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h3">Animações</Typography>
        <Button
          label={
            vm.preferences.reduceMotion
              ? 'Reativar animações'
              : 'Reduzir animações'
          }
          variant="secondary"
          onPress={vm.toggleReduceMotion}
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
