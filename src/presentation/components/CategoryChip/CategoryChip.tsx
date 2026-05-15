import React from 'react';
import { Chip } from '@/presentation/components/Chip';
import type { Category } from '@/domain/entities';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  return (
    <Chip
      label={category.name}
      color={category.color}
      selected={selected}
      onPress={onPress}
    />
  );
}
