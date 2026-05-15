import React from 'react';
import { useFeedbackStore } from '@/presentation/stores';
import { XPToast } from '@/presentation/components/XPToast';
import { LevelUpModal } from '@/presentation/components/LevelUpModal';
import { AchievementUnlockModal } from '@/presentation/components/AchievementUnlockModal';

export function GamificationFeedback() {
  const pendingLevelUp = useFeedbackStore((s) => s.pendingLevelUp);

  return (
    <>
      <XPToast />
      {pendingLevelUp ? <LevelUpModal /> : <AchievementUnlockModal />}
    </>
  );
}
