export {
  type Category,
  type CreateCategoryProps,
  type UpdateCategoryProps,
  createCategory,
  updateCategory,
} from './Category';

export {
  type Task,
  type CreateTaskProps,
  createTask,
  completeTask,
  reopenTask,
  isTaskCompleted,
  isTaskOverdue,
  isSubtask,
  canCompleteParent,
} from './Task';

export {
  type User,
  type CreateUserProps,
  createUser,
  renameUser,
  setAvatar,
  awardXP,
  setStreak,
  earnCoins,
  spendCoins,
  completeOnboarding,
} from './User';

export {
  type Reward,
  type CreateRewardProps,
  type UpdateRewardProps,
  createReward,
  updateReward,
} from './Reward';

export {
  type RewardRedemption,
  type CreateRewardRedemptionProps,
  createRewardRedemption,
} from './RewardRedemption';

export {
  type Achievement,
  type AchievementRequirement,
  coinRewardForRequirement,
} from './Achievement';

export {
  type UserAchievement,
  unlockAchievement,
} from './UserAchievement';

export {
  type FocusSession,
  type StartFocusSessionProps,
  startFocusSession,
  endFocusSession,
  isFocusSessionActive,
  isFocusSessionCompletedSuccessfully,
  focusSessionDurationMinutes,
} from './FocusSession';

export {
  type XPLog,
  type XPSource,
  type CreateXPLogProps,
  createXPLog,
} from './XPLog';

export {
  type TaskDailyCompletion,
  recordDailyCompletion,
  dayKeyFromISODate,
} from './TaskDailyCompletion';
