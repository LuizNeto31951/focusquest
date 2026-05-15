import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task } from '@/domain/entities';
import type { ListTasksInput } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useTasks(input: ListTasksInput) {
  const { listTasks } = useAppDependencies();
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inputKey = JSON.stringify(input);
  const inputRef = useRef(input);
  inputRef.current = input;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTasks.execute(inputRef.current);
      setTasks(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [listTasks]);

  useEffect(() => {
    load();
  }, [inputKey, load, tasksVersion]);

  return { tasks, loading, error, refetch: load };
}
