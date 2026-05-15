import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
  Chip,
  CategoryChip,
  PriorityChip,
  DateTimeField,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { Priority, Weekday } from '@/domain/value-objects';
import { ALL_PRIORITIES, ALL_WEEKDAYS } from '@/domain/value-objects';
import type { TasksStackParamList } from '@/presentation/navigation/types';
import { useTaskFormScreen, type RecurrenceMode } from './useTaskFormScreen';
import { createStyles } from './TaskFormScreen.styles';

type Props = NativeStackScreenProps<TasksStackParamList, 'TaskForm'>['route'];

const RECURRENCE_LABELS: Record<RecurrenceMode, string> = {
  NONE: 'Não repete',
  DAILY: 'Todos os dias',
  WEEKLY: 'Semanalmente',
  CUSTOM: 'A cada N dias',
};

const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

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
      // mantém usuário na tela; erros aparecem inline + banner
    }
  }

  if (vm.loadingTaskData) {
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
          errorText={vm.errors.title}
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
        <Typography variant="label" color="secondary">
          Categoria
        </Typography>
        {vm.loadingCategories ? (
          <ActivityIndicator color={theme.colors.accent} />
        ) : (
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
        )}
        {vm.errors.categoryId ? (
          <Typography variant="caption" color="danger">
            {vm.errors.categoryId}
          </Typography>
        ) : null}
      </View>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Prioridade
        </Typography>
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
          onChangeText={(text) =>
            vm.update('estimatedMinutes', text.replace(/[^0-9]/g, ''))
          }
          keyboardType="number-pad"
          errorText={vm.errors.estimatedMinutes}
        />
      </View>

      <View style={styles.section}>
        <DateTimeField
          label="Prazo (opcional)"
          value={vm.form.dueDate}
          onChange={(iso) => vm.update('dueDate', iso)}
          mode="datetime"
          helperText="Quando a tarefa precisa estar concluída"
        />
      </View>

      <View style={styles.section}>
        <DateTimeField
          label={
            vm.form.recurrenceMode === 'NONE'
              ? 'Horário de início (opcional)'
              : 'Horário (toca em cada dia da recorrência)'
          }
          value={vm.form.scheduledStartAt}
          onChange={(iso) => vm.update('scheduledStartAt', iso)}
          mode={vm.form.recurrenceMode === 'NONE' ? 'datetime' : 'time'}
          helperText={
            vm.form.recurrenceMode === 'NONE'
              ? 'Você receberá uma notificação neste horário'
              : 'A notificação dispara nos dias marcados, neste horário'
          }
        />
      </View>

      {!vm.isSubtask ? (
        <>
          <View style={styles.section}>
            <Typography variant="label" color="secondary">
              Repetição
            </Typography>
            <View style={styles.row}>
              {(['NONE', 'DAILY', 'WEEKLY', 'CUSTOM'] as RecurrenceMode[]).map(
                (mode) => (
                  <Chip
                    key={mode}
                    label={RECURRENCE_LABELS[mode]}
                    selected={vm.form.recurrenceMode === mode}
                    onPress={() => vm.update('recurrenceMode', mode)}
                  />
                ),
              )}
            </View>
          </View>

          {vm.form.recurrenceMode === 'WEEKLY' ? (
            <View style={styles.section}>
              <Typography variant="label" color="secondary">
                Dias da semana
              </Typography>
              <View style={styles.row}>
                {ALL_WEEKDAYS.map((day) => (
                  <Chip
                    key={day}
                    label={WEEKDAY_LABELS[day]}
                    selected={vm.form.weeklyDays.includes(day)}
                    onPress={() => vm.toggleWeekday(day)}
                  />
                ))}
              </View>
              {vm.errors.weeklyDays ? (
                <Typography variant="caption" color="danger">
                  {vm.errors.weeklyDays}
                </Typography>
              ) : null}
            </View>
          ) : null}

          {vm.form.recurrenceMode === 'CUSTOM' ? (
            <View style={styles.section}>
              <Input
                label="Repetir a cada quantos dias?"
                value={vm.form.customIntervalDays}
                onChangeText={(text) =>
                  vm.update('customIntervalDays', text.replace(/[^0-9]/g, ''))
                }
                keyboardType="number-pad"
                errorText={vm.errors.customIntervalDays}
              />
            </View>
          ) : null}
        </>
      ) : null}

      {vm.submitError ? (
        <Typography variant="body" color="danger" style={styles.errorText}>
          {vm.submitError.message}
        </Typography>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={vm.isEdit ? 'Salvar alterações' : 'Criar tarefa'}
          fullWidth
          loading={vm.submitting}
          disabled={vm.submitAttempted && !vm.isValid}
          onPress={handleSubmit}
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
