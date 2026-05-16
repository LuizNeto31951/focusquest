import { useCallback, useState } from 'react';
import type { AchievementRequirement } from '@/domain/entities';
import { useCreateCustomAchievement } from '@/presentation/hooks';
import { ACHIEVEMENT_ICON_OPTIONS } from '@/presentation/components';

export type RequirementKind =
  | 'TASKS_COMPLETED'
  | 'STREAK'
  | 'FOCUS_SESSIONS_IN_DAY'
  | 'UNINTERRUPTED_FOCUS_MINUTES'
  | 'LEVEL_REACHED';

export const REQUIREMENT_KINDS: readonly RequirementKind[] = [
  'TASKS_COMPLETED',
  'STREAK',
  'FOCUS_SESSIONS_IN_DAY',
  'UNINTERRUPTED_FOCUS_MINUTES',
  'LEVEL_REACHED',
];

export const REQUIREMENT_LABELS: Record<RequirementKind, string> = {
  TASKS_COMPLETED: 'Tarefas concluídas',
  STREAK: 'Sequência (dias)',
  FOCUS_SESSIONS_IN_DAY: 'Sessões de foco em um dia',
  UNINTERRUPTED_FOCUS_MINUTES: 'Minutos seguidos em foco',
  LEVEL_REACHED: 'Nível alcançado',
};

export function useAchievementEditorScreen() {
  const createAchievement = useCreateCustomAchievement();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState<string>(ACHIEVEMENT_ICON_OPTIONS[0]!);
  const [kind, setKind] = useState<RequirementKind>('TASKS_COMPLETED');
  const [target, setTarget] = useState('10');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const targetNumber = parseInt(target, 10);
  const targetError =
    submitAttempted && (Number.isNaN(targetNumber) || targetNumber < 1)
      ? 'Use um número >= 1'
      : undefined;
  const nameError =
    submitAttempted && !name.trim() ? 'Nome obrigatório' : undefined;
  const isValid =
    name.trim().length > 0 && !Number.isNaN(targetNumber) && targetNumber >= 1;

  const buildRequirement = useCallback((): AchievementRequirement => {
    switch (kind) {
      case 'TASKS_COMPLETED':
        return { kind: 'TASKS_COMPLETED', count: targetNumber };
      case 'STREAK':
        return { kind: 'STREAK', days: targetNumber };
      case 'FOCUS_SESSIONS_IN_DAY':
        return { kind: 'FOCUS_SESSIONS_IN_DAY', count: targetNumber };
      case 'UNINTERRUPTED_FOCUS_MINUTES':
        return { kind: 'UNINTERRUPTED_FOCUS_MINUTES', minutes: targetNumber };
      case 'LEVEL_REACHED':
        return { kind: 'LEVEL_REACHED', level: targetNumber };
    }
  }, [kind, targetNumber]);

  const submit = useCallback(async () => {
    setSubmitAttempted(true);
    if (!isValid) {
      throw new Error('Preencha os campos corretamente');
    }
    await createAchievement.run({
      name,
      description,
      iconName,
      requirement: buildRequirement(),
    });
  }, [isValid, name, description, iconName, buildRequirement, createAchievement]);

  return {
    name,
    setName,
    description,
    setDescription,
    iconName,
    setIconName,
    kind,
    setKind,
    target,
    setTarget,
    nameError,
    targetError,
    isValid,
    submitAttempted,
    submit,
    submitting: createAchievement.loading,
    submitError: createAchievement.error,
  };
}
