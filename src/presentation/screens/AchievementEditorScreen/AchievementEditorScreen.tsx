import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ACHIEVEMENT_ICON_OPTIONS,
  Button,
  Chip,
  Icon,
  Input,
  Screen,
  Typography,
  resolveIcon,
  type IconKey,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { AchievementsStackParamList } from '@/presentation/navigation/types';
import {
  REQUIREMENT_KINDS,
  REQUIREMENT_LABELS,
  useAchievementEditorScreen,
} from './useAchievementEditorScreen';
import { createStyles } from './AchievementEditorScreen.styles';

export function AchievementEditorScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<AchievementsStackParamList>>();
  const vm = useAchievementEditorScreen();
  const PreviewIcon = resolveIcon(vm.iconName);

  async function handleSave() {
    try {
      await vm.submit();
      navigation.goBack();
    } catch {
      // erros exibidos inline / banner
    }
  }

  return (
    <Screen scroll>
      <View style={styles.preview}>
        <View style={styles.previewCircle}>
          <Icon
            name={PreviewIcon}
            size={36}
            color={theme.colors.textOnAccent}
          />
        </View>
        <Typography variant="bodyEmphasis" align="center">
          {vm.name || 'Nova meta'}
        </Typography>
        <Typography variant="caption" color="secondary" align="center">
          {vm.description || 'Sem descrição'}
        </Typography>
      </View>

      <View style={styles.section}>
        <Input
          label="Nome"
          value={vm.name}
          onChangeText={vm.setName}
          placeholder="Ex.: Mestre da concentração"
          errorText={vm.nameError}
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Descrição (opcional)"
          value={vm.description}
          onChangeText={vm.setDescription}
          placeholder="O que essa meta representa?"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Tipo de meta
        </Typography>
        <View style={styles.chipsRow}>
          {REQUIREMENT_KINDS.map((k) => (
            <Chip
              key={k}
              label={REQUIREMENT_LABELS[k]}
              selected={vm.kind === k}
              onPress={() => vm.setKind(k)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Input
          label="Quantidade alvo"
          value={vm.target}
          onChangeText={(text) => vm.setTarget(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          errorText={vm.targetError}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Ícone
        </Typography>
        <View style={styles.iconGrid}>
          {ACHIEVEMENT_ICON_OPTIONS.map((iconKey) => {
            const IconComp = resolveIcon(iconKey);
            const active = vm.iconName === iconKey;
            return (
              <Pressable
                key={iconKey}
                accessibilityRole="button"
                accessibilityLabel={`Ícone ${iconKey}`}
                onPress={() => vm.setIconName(iconKey as IconKey)}
                style={[styles.iconCell, active && styles.iconCellActive]}
              >
                <Icon
                  name={IconComp}
                  size={22}
                  color={
                    active
                      ? theme.colors.textOnAccent
                      : theme.colors.textPrimary
                  }
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {vm.submitError ? (
        <Typography variant="body" color="danger" style={styles.errorText}>
          {vm.submitError.message}
        </Typography>
      ) : null}

      <View style={styles.actions}>
        <Button
          label="Criar meta"
          fullWidth
          loading={vm.submitting}
          disabled={vm.submitAttempted && !vm.isValid}
          onPress={handleSave}
        />
        <Button
          label="Cancelar"
          variant="ghost"
          fullWidth
          disabled={vm.submitting}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
