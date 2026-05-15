import { useCallback, useEffect, useState } from 'react';
import { UniqueId, ISODate } from '@/shared/types';
import {
  useCategories,
  useCreateTask,
  useCurrentUser,
  useTaskWithSubtasks,
  useUpdateTask,
} from '@/presentation/hooks';
import type { Priority } from '@/domain/value-objects';

export interface TaskFormState {
  title: string;
  description: string;
  categoryId?: UniqueId;
  priority: Priority;
  estimatedMinutes: string;
  dueDate?: string;
}

const EMPTY: TaskFormState = {
  title: '',
  description: '',
  categoryId: undefined,
  priority: 'MEDIUM',
  estimatedMinutes: '25',
  dueDate: undefined,
};

export function useTaskFormScreen(taskId?: string, parentTaskIdParam?: string) {
  const taskUniqueId = taskId ? UniqueId.from(taskId) : undefined;
  const parentTaskId = parentTaskIdParam ? UniqueId.from(parentTaskIdParam) : undefined;
  const isEdit = Boolean(taskUniqueId);

  const { user } = useCurrentUser();
  const { categories } = useCategories();
  const { data } = useTaskWithSubtasks(taskUniqueId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [form, setForm] = useState<TaskFormState>(EMPTY);

  useEffect(() => {
    if (data?.task) {
      setForm({
        title: data.task.title,
        description: data.task.description ?? '',
        categoryId: data.task.categoryId,
        priority: data.task.priority,
        estimatedMinutes: String(data.task.estimatedMinutes),
        dueDate: data.task.dueDate,
      });
    } else if (!isEdit && categories.length > 0 && !form.categoryId) {
      setForm((f) => ({ ...f, categoryId: categories[0]!.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.task, categories.length, isEdit]);

  const update = useCallback(<K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const submit = useCallback(async () => {
    if (!user) throw new Error('User not loaded');
    if (!form.categoryId) throw new Error('Selecione uma categoria');
    const minutes = parseInt(form.estimatedMinutes, 10);
    if (Number.isNaN(minutes) || minutes < 0) {
      throw new Error('Duração inválida');
    }

    const dueDate = form.dueDate ? ISODate.from(form.dueDate) : undefined;

    if (isEdit && taskUniqueId) {
      await updateTask.run({
        id: taskUniqueId,
        categoryId: form.categoryId,
        title: form.title,
        description: form.description.trim() ? form.description : null,
        priority: form.priority,
        estimatedMinutes: minutes,
        dueDate: dueDate ?? null,
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
      });
    }
  }, [user, form, isEdit, taskUniqueId, parentTaskId, createTask, updateTask]);

  return {
    isEdit,
    form,
    update,
    categories,
    submit,
    loading: createTask.loading || updateTask.loading,
    error: createTask.error ?? updateTask.error,
  };
}
