import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Screen,
  Typography,
  Input,
  Button,
  CategoryChip,
  PriorityChip,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { Priority } from '@/domain/value-objects';
import { ALL_PRIORITIES } from '@/domain/value-objects';
import type { TasksStackParamList } from '@/presentation/navigation/types';
import { useTaskFormScreen } from './useTaskFormScreen';
import { createStyles } from './TaskFormScreen.styles';

type Props = NativeStackScreenProps<TasksStackParamList, 'TaskForm'>['route'];

export function TaskFormScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<TasksStackParamList>>();
  const route = useRoute<Props>();
  const { taskId, parentTaskId } = route.params ?? {};
  const vm = useTaskFormScreen(taskId, parentTaskId);

  async function handleSubmit() {
    try {
      await vm.submit();
      navigation.goBack();
    } catch {
      // erro já exposto via vm.error
    }
  }

  return (
    <Screen scroll>
      <Typography variant="h2" style={styles.section}>
        {vm.isEdit ? 'Editar tarefa' : 'Nova tarefa'}
      </Typography>

      <View style={styles.section}>
        <Input
          label="Título"
          value={vm.form.title}
          onChangeText={(text) => vm.update('title', text)}
          placeholder="O que você precisa fazer?"
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Descrição (opcional)"
          value={vm.form.description}
          onChangeText={(text) => vm.update('description', text)}
          placeholder="Detalhes, contexto..."
          multiline
        />
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">Categoria</Typography>
        <View style={styles.row}>
          {vm.categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={vm.form.categoryId === cat.id}
              onPress={() => vm.update('categoryId', cat.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">Prioridade</Typography>
        <View style={styles.row}>
          {ALL_PRIORITIES.map((p: Priority) => (
            <PriorityChip
              key={p}
              priority={p}
              selected={vm.form.priority === p}
              onPress={() => vm.update('priority', p)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Input
          label="Duração estimada (minutos)"
          value={vm.form.estimatedMinutes}
          onChangeText={(text) => vm.update('estimatedMinutes', text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
        />
      </View>

      {vm.error ? (
        <Typography variant="body" color="danger" style={styles.errorText}>
          {vm.error.message}
        </Typography>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={vm.isEdit ? 'Salvar alterações' : 'Criar tarefa'}
          fullWidth
          loading={vm.loading}
          onPress={handleSubmit}
        />
        <Button
          label="Cancelar"
          variant="ghost"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
