import React, { useMemo } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Screen,
  Typography,
  Button,
  Card,
  TaskCard,
  CategoryChip,
  PriorityChip,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { isTaskCompleted } from '@/domain/entities';
import type { TasksStackParamList } from '@/presentation/navigation/types';
import { useTaskDetailScreen } from './useTaskDetailScreen';
import { createStyles } from './TaskDetailScreen.styles';

type RouteProp = NativeStackScreenProps<TasksStackParamList, 'TaskDetail'>['route'];

export function TaskDetailScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<TasksStackParamList>>();
  const route = useRoute<RouteProp>();
  const { taskId } = route.params;
  const vm = useTaskDetailScreen(taskId);

  if (!vm.data) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Typography variant="body" color="secondary">
            Carregando tarefa...
          </Typography>
        </View>
      </Screen>
    );
  }

  const { task, subtasks } = vm.data;
  const completed = isTaskCompleted(task);

  async function handleDelete() {
    try {
      await vm.remove();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Não foi possível excluir', (err as Error).message);
    }
  }

  async function handleComplete() {
    try {
      await vm.complete();
    } catch (err) {
      Alert.alert('Não foi possível concluir', (err as Error).message);
    }
  }

  async function handleCompleteSubtask(subId: import('@/shared/types').UniqueId) {
    try {
      await vm.completeSubtask(subId);
    } catch (err) {
      Alert.alert('Não foi possível concluir', (err as Error).message);
    }
  }

  return (
    <Screen scroll>
      <View style={styles.section}>
        <Typography variant="h1">{task.title}</Typography>
        {task.description ? (
          <Typography variant="body" color="secondary">
            {task.description}
          </Typography>
        ) : null}
      </View>

      <Card style={styles.section}>
        <Typography variant="label" color="secondary">Detalhes</Typography>
        <View style={styles.row}>
          {vm.category ? <CategoryChip category={vm.category} /> : null}
          <PriorityChip priority={task.priority} />
        </View>
        <Typography variant="caption" color="secondary">
          Duração estimada: {task.estimatedMinutes} min
        </Typography>
        {task.dueDate ? (
          <Typography variant="caption" color="secondary">
            Prazo: {new Date(task.dueDate).toLocaleString('pt-BR')}
          </Typography>
        ) : null}
        {task.isRecurring ? (
          <Typography variant="caption" color="accent">
            Tarefa recorrente
          </Typography>
        ) : completed ? (
          <Typography variant="caption" color="success">
            Concluída em {new Date(task.completedAt!).toLocaleString('pt-BR')}
          </Typography>
        ) : null}
      </Card>

      {subtasks.length > 0 ? (
        <View style={styles.section}>
          <Typography variant="h3">Subtarefas</Typography>
          <View style={styles.subtasks}>
            {subtasks.map((sub) => (
              <TaskCard
                key={sub.id}
                task={sub}
                onToggleComplete={() => handleCompleteSubtask(sub.id)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.actions}>
        {!completed || task.isRecurring ? (
          <Button
            label={task.isRecurring ? 'Concluir hoje' : 'Marcar como concluída'}
            fullWidth
            loading={vm.completing}
            disabled={vm.deleting}
            onPress={handleComplete}
          />
        ) : null}
        <Button
          label="Adicionar subtarefa"
          variant="secondary"
          fullWidth
          disabled={vm.completing || vm.deleting}
          onPress={() =>
            navigation.navigate('TaskForm', { parentTaskId: task.id })
          }
        />
        <Button
          label="Editar"
          variant="secondary"
          fullWidth
          disabled={vm.completing || vm.deleting}
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
        />
        <Button
          label="Excluir"
          variant="danger"
          fullWidth
          loading={vm.deleting}
          disabled={vm.completing}
          onPress={handleDelete}
        />
      </View>
    </Screen>
  );
}
