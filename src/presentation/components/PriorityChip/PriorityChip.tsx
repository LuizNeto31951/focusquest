import React from 'react';
import { useTheme } from '@/presentation/providers';
import { Chip } from '@/presentation/components/Chip';
import type { Priority } from '@/domain/value-objects';

interface PriorityChipProps {
  priority: Priority;
  selected?: boolean;
  onPress?: () => void;
}

const LABELS: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
};

export function PriorityChip({ priority, selected, onPress }: PriorityChipProps) {
  const theme = useTheme();
  const colorByPriority: Record<Priority, string> = {
    LOW: theme.colors.textSecondary,
    MEDIUM: theme.colors.warning,
    HIGH: theme.colors.danger,
  };
  return (
    <Chip
      label={LABELS[priority]}
      color={colorByPriority[priority]}
      selected={selected}
      onPress={onPress}
    />
  );
}
