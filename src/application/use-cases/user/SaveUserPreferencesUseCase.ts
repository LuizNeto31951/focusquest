import type { UniqueId } from '@/shared/types';
import {
  createUserPreferences,
  type DensityPreference,
  type ThemeModePreference,
  type UserPreferences,
} from '@/domain/entities';
import type { UserPreferencesRepository } from '@/domain/repositories';
import type { Clock } from '@/application/ports';

export interface SaveUserPreferencesInput {
  userId: UniqueId;
  mode: ThemeModePreference;
  accent: string;
  fontScale: number;
  density: DensityPreference;
  reduceMotion: boolean;
}

export class SaveUserPreferencesUseCase {
  constructor(
    private readonly repository: UserPreferencesRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: SaveUserPreferencesInput): Promise<UserPreferences> {
    const prefs = createUserPreferences({
      userId: input.userId,
      mode: input.mode,
      accent: input.accent,
      fontScale: input.fontScale,
      density: input.density,
      reduceMotion: input.reduceMotion,
      now: this.clock.now(),
    });
    await this.repository.save(prefs);
    return prefs;
  }
}
