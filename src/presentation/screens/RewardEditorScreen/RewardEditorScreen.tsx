import React, { useMemo } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Button,
  Chip,
  CoinBadge,
  Icon,
  Input,
  REWARD_ICON_OPTIONS,
  Screen,
  Typography,
  resolveIcon,
  type IconKey,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ShopStackParamList } from '@/presentation/navigation/types';
import {
  REWARD_CATEGORIES,
  REWARD_COLORS,
  useRewardEditorScreen,
} from './useRewardEditorScreen';
import { createStyles } from './RewardEditorScreen.styles';

type RouteProp = NativeStackScreenProps<
  ShopStackParamList,
  'RewardEditor'
>['route'];

export function RewardEditorScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ShopStackParamList>>();
  const route = useRoute<RouteProp>();
  const { rewardId } = route.params ?? {};
  const vm = useRewardEditorScreen(rewardId);
  const PreviewIcon = resolveIcon(vm.iconKey);
  const costNumber = parseInt(vm.costText, 10);

  async function handleSave() {
    try {
      await vm.submit();
      navigation.goBack();
    } catch {
      // erro exibido inline
    }
  }

  function confirmDelete() {
    Alert.alert('Remover recompensa', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await vm.deleteReward();
            navigation.goBack();
          } catch (err) {
            Alert.alert(
              'Não foi possível remover',
              (err as Error).message,
            );
          }
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <View style={styles.preview}>
        {vm.imageUri ? (
          <Image source={{ uri: vm.imageUri }} style={styles.previewImage} />
        ) : (
          <View
            style={[styles.previewCircle, { backgroundColor: vm.color }]}
          >
            <Icon
              name={PreviewIcon}
              size={42}
              color={theme.colors.textOnAccent}
            />
          </View>
        )}
        <Typography variant="bodyEmphasis" align="center">
          {vm.name || 'Nova recompensa'}
        </Typography>
        {!Number.isNaN(costNumber) && costNumber >= 1 ? (
          <CoinBadge amount={costNumber} size="md" variant="soft" />
        ) : null}
        <View style={styles.imageActions}>
          <Button
            label={vm.imageUri ? 'Trocar foto' : 'Adicionar foto'}
            variant="secondary"
            size="sm"
            loading={vm.pickingImage}
            onPress={vm.pickImage}
          />
          {vm.imageUri ? (
            <Button
              label="Remover foto"
              variant="ghost"
              size="sm"
              onPress={vm.removeImage}
            />
          ) : null}
        </View>
        {vm.imageError ? (
          <Typography variant="caption" color="danger">
            {vm.imageError}
          </Typography>
        ) : null}
      </View>

      <View style={styles.section}>
        <Input
          label="Nome"
          value={vm.name}
          onChangeText={vm.setName}
          placeholder="Ex.: Filme no domingo"
          errorText={vm.nameError}
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Descrição (opcional)"
          value={vm.description}
          onChangeText={vm.setDescription}
          placeholder="O que essa recompensa significa pra você?"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Preço em moedas"
          value={vm.costText}
          onChangeText={(text) => vm.setCostText(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          errorText={vm.costError}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Categoria
        </Typography>
        <View style={styles.chipsRow}>
          {REWARD_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={vm.category === cat}
              onPress={() => vm.setCategory(cat)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Cor
        </Typography>
        <View style={styles.swatchRow}>
          {REWARD_COLORS.map((c) => {
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
          {REWARD_ICON_OPTIONS.map((iconKey) => {
            const IconComp = resolveIcon(iconKey);
            const active = vm.iconKey === iconKey;
            return (
              <Pressable
                key={iconKey}
                accessibilityRole="button"
                accessibilityLabel={`Ícone ${iconKey}`}
                onPress={() => vm.setIconKey(iconKey as IconKey)}
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
          label={vm.isEdit ? 'Salvar alterações' : 'Criar recompensa'}
          fullWidth
          loading={vm.submitting}
          disabled={vm.submitAttempted && !vm.isValid}
          onPress={handleSave}
        />
        {vm.isEdit ? (
          <Button
            label="Remover recompensa"
            variant="ghost"
            fullWidth
            loading={vm.deleting}
            onPress={confirmDelete}
          />
        ) : null}
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
