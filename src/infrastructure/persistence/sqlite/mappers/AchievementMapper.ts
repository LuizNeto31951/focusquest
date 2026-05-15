import type { Achievement, AchievementRequirement } from '@/domain/entities';

export interface AchievementRow {
  code: string;
  name: string;
  description: string;
  icon_name: string;
  requirement: string;
}

export const AchievementMapper = {
  toRow(achievement: Achievement): AchievementRow {
    return {
      code: achievement.code,
      name: achievement.name,
      description: achievement.description,
      icon_name: achievement.iconName,
      requirement: JSON.stringify(achievement.requirement),
    };
  },

  toDomain(row: AchievementRow): Achievement {
    return {
      code: row.code,
      name: row.name,
      description: row.description,
      iconName: row.icon_name,
      requirement: JSON.parse(row.requirement) as AchievementRequirement,
    };
  },
};
