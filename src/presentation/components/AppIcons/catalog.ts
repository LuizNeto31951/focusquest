import type { ComponentType } from 'react';
import {
  Award,
  Book,
  BookOpen,
  Briefcase,
  Camera,
  Circle,
  Code,
  Coffee,
  Cookie,
  Dumbbell,
  Film,
  Flame,
  Gamepad2,
  Gift,
  Headphones,
  Heart,
  HeartPulse,
  Home,
  IceCream,
  Medal,
  Music,
  Palette,
  Pizza,
  Plane,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Sunrise,
  Target,
  Ticket,
  Trophy,
  User,
  type LucideProps,
} from 'lucide-react-native';

export type IconKey =
  | 'book-open'
  | 'briefcase'
  | 'heart-pulse'
  | 'home'
  | 'user'
  | 'circle'
  | 'dumbbell'
  | 'shopping-cart'
  | 'music'
  | 'palette'
  | 'code'
  | 'coffee'
  | 'plane'
  | 'camera'
  | 'book'
  | 'star'
  | 'trophy'
  | 'gamepad'
  | 'heart'
  | 'sparkles'
  | 'sunrise'
  | 'flame'
  | 'target'
  | 'shield-check'
  | 'medal'
  | 'award'
  | 'gift'
  | 'ice-cream'
  | 'cookie'
  | 'pizza'
  | 'film'
  | 'ticket'
  | 'shopping-bag'
  | 'headphones';

export const ICON_CATALOG: Record<IconKey, ComponentType<LucideProps>> = {
  'book-open': BookOpen,
  briefcase: Briefcase,
  'heart-pulse': HeartPulse,
  home: Home,
  user: User,
  circle: Circle,
  dumbbell: Dumbbell,
  'shopping-cart': ShoppingCart,
  music: Music,
  palette: Palette,
  code: Code,
  coffee: Coffee,
  plane: Plane,
  camera: Camera,
  book: Book,
  star: Star,
  trophy: Trophy,
  gamepad: Gamepad2,
  heart: Heart,
  sparkles: Sparkles,
  sunrise: Sunrise,
  flame: Flame,
  target: Target,
  'shield-check': ShieldCheck,
  medal: Medal,
  award: Award,
  gift: Gift,
  'ice-cream': IceCream,
  cookie: Cookie,
  pizza: Pizza,
  film: Film,
  ticket: Ticket,
  'shopping-bag': ShoppingBag,
  headphones: Headphones,
};

export const CATEGORY_ICON_OPTIONS: readonly IconKey[] = [
  'book-open',
  'briefcase',
  'heart-pulse',
  'home',
  'user',
  'dumbbell',
  'shopping-cart',
  'music',
  'palette',
  'code',
  'coffee',
  'plane',
  'camera',
  'book',
  'heart',
  'circle',
];

export const ACHIEVEMENT_ICON_OPTIONS: readonly IconKey[] = [
  'trophy',
  'medal',
  'star',
  'award',
  'sparkles',
  'sunrise',
  'flame',
  'target',
  'shield-check',
  'gamepad',
];

export const REWARD_ICON_OPTIONS: readonly IconKey[] = [
  'gift',
  'ice-cream',
  'cookie',
  'pizza',
  'coffee',
  'film',
  'ticket',
  'gamepad',
  'music',
  'headphones',
  'shopping-bag',
  'shopping-cart',
  'sparkles',
  'heart',
  'star',
  'sunrise',
  'plane',
  'book',
];

export function resolveIcon(key: string | undefined): ComponentType<LucideProps> {
  if (!key) return Circle;
  return ICON_CATALOG[key as IconKey] ?? Circle;
}
