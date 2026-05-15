import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Screen, Typography, Button } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { accentPresets, fontScales } from '@/presentation/theme';
import type { AccentPreset, Density } from '@/presentation/theme';
import { useHomeScreen } from './useHomeScreen';
import { createStyles } from './HomeScreen.styles';

const ACCENTS = Object.keys(accentPresets) as AccentPreset[];
const DENSITIES: Density[] = ['compact', 'normal', 'comfortable'];

export function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useHomeScreen();

  return (
    <Screen scroll>
      <View style={styles.welcomeCard}>
        <Typography variant="display">FocusQuest</Typography>
        <Typography variant="body" color="secondary">
          Sua rotina, do seu jeito. Personalize abaixo e veja como o app se adapta.
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Modo
        </Typography>
        <Button
          label={vm.mode === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
          variant="secondary"
          onPress={vm.toggleMode}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Cor de destaque
        </Typography>
        <View style={styles.accentRow}>
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
        <Typography variant="h3" style={styles.sectionTitle}>
          Tamanho do texto
        </Typography>
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
        <Typography variant="h3" style={styles.sectionTitle}>
          Densidade
        </Typography>
        <View style={styles.row}>
          {DENSITIES.map((density) => (
            <Button
              key={density}
              label={density}
              size="sm"
              variant={vm.preferences.density === density ? 'primary' : 'secondary'}
              onPress={() => vm.setDensity(density)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Animações
        </Typography>
        <Button
          label={vm.preferences.reduceMotion ? 'Reativar animações' : 'Reduzir animações'}
          variant="secondary"
          onPress={vm.toggleReduceMotion}
        />
      </View>

      <View style={styles.section}>
        <Button label="Restaurar padrões" variant="ghost" onPress={vm.resetPreferences} />
      </View>
    </Screen>
  );
}
