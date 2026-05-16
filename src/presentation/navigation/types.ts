import type { NavigatorScreenParams } from '@react-navigation/native';

export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string; parentTaskId?: string };
};

export type FocusStackParamList = {
  FocusHome: undefined;
  FocusActive: { sessionId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Categories: undefined;
  CategoryEditor: { categoryId?: string };
};

export type AchievementsStackParamList = {
  AchievementsList: undefined;
  AchievementEditor: undefined;
};

export type ShopStackParamList = {
  RewardsShop: undefined;
  RewardEditor: { rewardId?: string };
  Redemptions: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Tasks: NavigatorScreenParams<TasksStackParamList>;
  Focus: NavigatorScreenParams<FocusStackParamList>;
  Shop: NavigatorScreenParams<ShopStackParamList>;
  Achievements: NavigatorScreenParams<AchievementsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};
