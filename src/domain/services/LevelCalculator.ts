import { XP, Level } from '@/domain/value-objects';

const MAX_LEVEL = 999;

function incrementForLevel(level: number): number {
  return Math.floor(100 * level * Math.pow(1.5, level - 1));
}

export const LevelCalculator = {
  thresholdForLevel(targetLevel: Level): XP {
    if (targetLevel <= 1) return XP.zero();
    let total = 0;
    for (let i = 1; i < targetLevel; i++) {
      total += incrementForLevel(i);
    }
    return XP.from(total);
  },

  levelFromTotalXP(totalXP: XP): Level {
    let level: number = 1;
    while (level < MAX_LEVEL) {
      const nextThreshold = this.thresholdForLevel(Level.from(level + 1));
      if (nextThreshold > totalXP) break;
      level++;
    }
    return Level.from(level);
  },

  xpRemainingToNextLevel(totalXP: XP): XP {
    const current = this.levelFromTotalXP(totalXP);
    if (current >= MAX_LEVEL) return XP.zero();
    const nextThreshold = this.thresholdForLevel(Level.from(current + 1));
    return XP.subtractClamped(nextThreshold, totalXP);
  },

  progressInCurrentLevel(totalXP: XP): number {
    const current = this.levelFromTotalXP(totalXP);
    const start = this.thresholdForLevel(current);
    if (current >= MAX_LEVEL) return 1;
    const next = this.thresholdForLevel(Level.from(current + 1));
    const span = next - start;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (totalXP - start) / span));
  },

  hasLeveledUp(previousXP: XP, newXP: XP): boolean {
    return this.levelFromTotalXP(newXP) > this.levelFromTotalXP(previousXP);
  },
};
