import { UniqueId } from '@/shared/types';
import type { Category } from '@/domain/entities';

export const DEFAULT_CATEGORIES: readonly Category[] = [
  {
    id: UniqueId.from('11111111-1111-4111-8111-111111111111'),
    name: 'Estudo',
    color: '#4F46E5',
    icon: 'book-open',
    isDefault: true,
  },
  {
    id: UniqueId.from('22222222-2222-4222-8222-222222222222'),
    name: 'Trabalho',
    color: '#0D9488',
    icon: 'briefcase',
    isDefault: true,
  },
  {
    id: UniqueId.from('33333333-3333-4333-8333-333333333333'),
    name: 'Saúde',
    color: '#16A34A',
    icon: 'heart-pulse',
    isDefault: true,
  },
  {
    id: UniqueId.from('44444444-4444-4444-8444-444444444444'),
    name: 'Casa',
    color: '#D97706',
    icon: 'home',
    isDefault: true,
  },
  {
    id: UniqueId.from('55555555-5555-4555-8555-555555555555'),
    name: 'Pessoal',
    color: '#DB2777',
    icon: 'user',
    isDefault: true,
  },
  {
    id: UniqueId.from('66666666-6666-4666-8666-666666666666'),
    name: 'Outro',
    color: '#64748B',
    icon: 'circle',
    isDefault: true,
  },
];
