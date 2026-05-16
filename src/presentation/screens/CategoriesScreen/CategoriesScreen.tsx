import React, { useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Trash2, ChevronRight } from 'lucide-react-native';
import {
  Button,
  Icon,
  Screen,
  Typography,
  resolveIcon,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ProfileStackParamList } from '@/presentation/navigation/types';
import { useCategoriesScreen } from './useCategoriesScreen';
import { createStyles } from './CategoriesScreen.styles';

export function CategoriesScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const vm = useCategoriesScreen();

  function handleEdit(id: string) {
    navigation.navigate('CategoryEditor', { categoryId: id });
  }

  function handleCreate() {
    navigation.navigate('CategoryEditor', {});
  }

  async function confirmDelete(id: string, name: string) {
    Alert.alert(
      'Excluir categoria',
      `Tem certeza que deseja excluir "${name}"? Isso só funciona se não houver tarefas usando.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await vm.remove(id as import('@/shared/types').UniqueId);
            } catch (err) {
              Alert.alert(
                'Não foi possível excluir',
                (err as Error).message,
              );
            }
          },
        },
      ],
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Typography variant="h3">Suas categorias</Typography>
        <Button
          label="Nova"
          variant="primary"
          size="sm"
          onPress={handleCreate}
        />
      </View>

      <View style={styles.list}>
        {vm.categories.map((cat) => {
          const IconComp = resolveIcon(cat.icon);
          return (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              onPress={() => handleEdit(cat.id)}
              style={styles.itemRow}
            >
              <View
                style={[styles.itemIcon, { backgroundColor: cat.color }]}
              >
                <Icon
                  name={IconComp}
                  size={20}
                  color={theme.colors.textOnAccent}
                />
              </View>
              <View style={styles.itemBody}>
                <Typography variant="bodyEmphasis">{cat.name}</Typography>
                <Typography variant="caption" color="secondary">
                  {cat.isDefault ? 'Categoria padrão' : 'Personalizada'}
                </Typography>
              </View>
              {cat.isDefault ? (
                <Icon
                  name={ChevronRight}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${cat.name}`}
                  onPress={() => confirmDelete(cat.id, cat.name)}
                  style={styles.deleteButton}
                  hitSlop={8}
                >
                  <Icon
                    name={Trash2}
                    size={20}
                    color={theme.colors.danger}
                  />
                </Pressable>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: theme.spacing.lg }}>
        <Button
          label="Nova categoria"
          variant="secondary"
          fullWidth
          onPress={handleCreate}
        />
      </View>
    </Screen>
  );
}
