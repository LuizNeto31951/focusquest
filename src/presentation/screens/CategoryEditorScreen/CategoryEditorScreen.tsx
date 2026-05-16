import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Button,
  CATEGORY_ICON_OPTIONS,
  Icon,
  Input,
  Screen,
  Typography,
  resolveIcon,
  type IconKey,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ProfileStackParamList } from '@/presentation/navigation/types';
import { useCategoryEditorScreen } from './useCategoryEditorScreen';
import { CATEGORY_COLORS } from './CategoryEditorAssets';
import { createStyles } from './CategoryEditorScreen.styles';

type RouteProp = NativeStackScreenProps<
  ProfileStackParamList,
  'CategoryEditor'
>['route'];

export function CategoryEditorScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<RouteProp>();
  const { categoryId } = route.params ?? {};
  const vm = useCategoryEditorScreen(categoryId);

  const PreviewIcon = resolveIcon(vm.icon);

  async function handleSave() {
    try {
      await vm.submit();
      navigation.goBack();
    } catch {
      // erro exibido via vm.submitError / vm.nameError
    }
  }

  return (
    <Screen scroll>
      <View style={styles.preview}>
        <View
          style={[styles.previewCircle, { backgroundColor: vm.color }]}
        >
          <Icon
            name={PreviewIcon}
            size={32}
            color={theme.colors.textOnAccent}
          />
        </View>
        <Typography variant="bodyEmphasis" align="center">
          {vm.name || 'Nova categoria'}
        </Typography>
      </View>

      <View style={styles.section}>
        <Input
          label="Nome"
          value={vm.name}
          onChangeText={vm.setName}
          placeholder="Ex.: Esportes"
          errorText={vm.nameError}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Cor
        </Typography>
        <View style={styles.swatchRow}>
          {CATEGORY_COLORS.map((c) => {
            const active = vm.color === c;
            return (
              <Pressable
                key={c}
                accessibilityRole="button"
                accessibilityLabel={`Cor ${c}`}
                onPress={() => vm.setColor(c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  active && styles.swatchActive,
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Ícone
        </Typography>
        <View style={styles.iconGrid}>
          {CATEGORY_ICON_OPTIONS.map((iconKey) => {
            const IconComp = resolveIcon(iconKey);
            const active = vm.icon === iconKey;
            return (
              <Pressable
                key={iconKey}
                accessibilityRole="button"
                accessibilityLabel={`Ícone ${iconKey}`}
                onPress={() => vm.setIcon(iconKey as IconKey)}
                style={[
                  styles.iconCell,
                  active && {
                    ...styles.iconCellActive,
                    borderColor: vm.color,
                    backgroundColor: vm.color,
                  },
                ]}
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
          label={vm.isEdit ? 'Salvar alterações' : 'Criar categoria'}
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
