import { useCallback, useEffect, useState } from 'react';
import { UniqueId, ISODate } from '@/shared/types';
import {
  useCategories,
  useCreateTask,
  useCurrentUser,
  useTaskWithSubtasks,
  useUpdateTask,
} from '@/presentation/hooks';
import {
  RecurrenceRule,
  type Priority,
  type Weekday,
} from '@/domain/value-objects';

export type RecurrenceMode = 'NONE' | 'DAILY' | 'WEEKLY' | 'CUSTOM';

export interface TaskFormState {
  title: string;
  description: string;
  categoryId?: UniqueId;
  priority: Priority;
  estimatedMinutes: string;
  dueDate?: string;
  recurrenceMode: RecurrenceMode;
  weeklyDays: readonly Weekday[];
  customIntervalDays: string;
}

const EMPTY: TaskFormState = {
  title: '',
  description: '',
  categoryId: undefined,
  priority: 'MEDIUM',
  estimatedMinutes: '25',
  dueDate: undefined,
  recurrenceMode: 'NONE',
  weeklyDays: [],
  customIntervalDays: '2',
};

export function useTaskFormScreen(taskId?: string, parentTaskIdParam?: string) {
  const taskUniqueId = taskId ? UniqueId.from(taskId) : undefined;
  const parentTaskId = parentTaskIdParam ? UniqueId.from(parentTaskIdParam) : undefined;
  const isEdit = Boolean(taskUniqueId);
  const isSubtask = Boolean(parentTaskId);

  const { user } = useCurrentUser();
  const { categories } = useCategories();
  const { data } = useTaskWithSubtasks(taskUniqueId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [form, setForm] = useState<TaskFormState>(EMPTY);

  useEffect(() => {
    if (data?.task) {
      const t = data.task;
      let recurrenceMode: RecurrenceMode = 'NONE';
      let weeklyDays: readonly Weekday[] = [];
      let customIntervalDays = '2';
      if (t.isRecurring && t.recurrenceRule) {
        const rule = t.recurrenceRule;
        if (rule.frequency === 'DAILY') recurrenceMode = 'DAILY';
        if (rule.frequency === 'WEEKLY') {
          recurrenceMode = 'WEEKLY';
          weeklyDays = rule.weekdays;
        }
        if (rule.frequency === 'CUSTOM') {
          recurrenceMode = 'CUSTOM';
          customIntervalDays = String(rule.intervalDays);
        }
      }
      setForm({
        title: t.title,
        description: t.description ?? '',
        categoryId: t.categoryId,
        priority: t.priority,
        estimatedMinutes: String(t.estimatedMinutes),
        dueDate: t.dueDate,
        recurrenceMode,
        weeklyDays,
        customIntervalDays,
      });
    } else if (!isEdit && categories.length > 0 && !form.categoryId) {
      setForm((f) => ({ ...f, categoryId: categories[0]!.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.task, categories.length, isEdit]);

  const update = useCallback(
    <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  const toggleWeekday = useCallback((day: Weekday) => {
    setForm((f) => {
      const set = new Set(f.weeklyDays);
      if (set.has(day)) set.delete(day);
      else set.add(day);
      const ordered = Array.from(set).sort((a, b) => a - b) as Weekday[];
      return { ...f, weeklyDays: ordered };
    });
  }, []);

  const submit = useCallback(async () => {
    if (!user) throw new Error('User not loaded');
    if (!form.categoryId) throw new Error('Selecione uma categoria');
    const minutes = parseInt(form.estimatedMinutes, 10);
    if (Number.isNaN(minutes) || minutes < 0) {
      throw new Error('Duração inválida');
    }

    const dueDate = form.dueDate ? ISODate.from(form.dueDate) : undefined;

    let isRecurring = false;
    let recurrenceRule: import('@/domain/value-objects').RecurrenceRule | undefined;
    if (!isSubtask && form.recurrenceMode !== 'NONE') {
      isRecurring = true;
      if (form.recurrenceMode === 'DAILY') {
        recurrenceRule = RecurrenceRule.daily();
      } else if (form.recurrenceMode === 'WEEKLY') {
        if (form.weeklyDays.length === 0) {
          throw new Error('Selecione ao menos um dia da semana');
        }
        recurrenceRule = RecurrenceRule.weekly(form.weeklyDays);
      } else if (form.recurrenceMode === 'CUSTOM') {
        const interval = parseInt(form.customIntervalDays, 10);
        if (Number.isNaN(interval) || interval < 1) {
          throw new Error('Intervalo inválido');
        }
        recurrenceRule = RecurrenceRule.custom(interval);
      }
    }

    if (isEdit && taskUniqueId) {
      await updateTask.run({
        id: taskUniqueId,
        categoryId: form.categoryId,
        title: form.title,
        description: form.description.trim() ? form.description : null,
        priority: form.priority,
        estimatedMinutes: minutes,
        dueDate: dueDate ?? null,
        isRecurring,
        recurrenceRule: recurrenceRule ?? null,
      });
    } else {
      await createTask.run({
        userId: user.id,
        categoryId: form.categoryId,
        parentTaskId,
        title: form.title,
        description: form.description.trim() || undefined,
        priority: form.priority,
        estimatedMinutes: minutes,
        dueDate,
        isRecurring,
        recurrenceRule,
      });
    }
  }, [
    user,
    form,
    isEdit,
    isSubtask,
    taskUniqueId,
    parentTaskId,
    createTask,
    updateTask,
  ]);

  return {
    isEdit,
    isSubtask,
    form,
    update,
    toggleWeekday,
    categories,
    submit,
    loading: createTask.loading || updateTask.loading,
    error: createTask.error ?? updateTask.error,
  };
}
