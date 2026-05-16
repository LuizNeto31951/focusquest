import React from 'react';
import { Chip } from '@/presentation/components/Chip';
import { resolveIcon } from '@/presentation/components/AppIcons';
import type { Category } from '@/domain/entities';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  const IconComp = resolveIcon(category.icon);
  return (
    <Chip
      label={category.name}
      color={category.color}
      icon={IconComp}
      selected={selected}
      onPress={onPress}
    />
  );
}
