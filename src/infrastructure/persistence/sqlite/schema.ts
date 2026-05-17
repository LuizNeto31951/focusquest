export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_uri TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_longest INTEGER NOT NULL DEFAULT 0,
  streak_last_active_date TEXT,
  coins INTEGER NOT NULL DEFAULT 0,
  onboarding_completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  parent_task_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  due_date TEXT,
  scheduled_start_at TEXT,
  completed_at TEXT,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  recurrence_rule TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at);

CREATE TABLE IF NOT EXISTS achievements (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  requirement TEXT NOT NULL,
  is_custom INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT NOT NULL,
  achievement_code TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  PRIMARY KEY (user_id, achievement_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_code) REFERENCES achievements(code)
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  planned_duration_minutes INTEGER NOT NULL,
  was_interrupted INTEGER NOT NULL DEFAULT 0,
  blocked_app_packages TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_active
  ON focus_sessions(user_id, ended_at);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at
  ON focus_sessions(started_at);

CREATE TABLE IF NOT EXISTS xp_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  amount INTEGER NOT NULL,
  task_id TEXT,
  focus_session_id TEXT,
  achievement_code TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_xp_logs_user_created
  ON xp_logs(user_id, created_at);

CREATE TABLE IF NOT EXISTS task_daily_completions (
  task_id TEXT NOT NULL,
  day TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (task_id, day),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_daily_completions_day
  ON task_daily_completions(day);

CREATE TABLE IF NOT EXISTS task_notifications (
  task_id TEXT NOT NULL,
  notification_id TEXT NOT NULL,
  PRIMARY KEY (task_id, notification_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_notifications_task_id
  ON task_notifications(task_id);

CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_key TEXT NOT NULL,
  color TEXT NOT NULL,
  image_uri TEXT,
  cost INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'Geral',
  is_favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rewards_category ON rewards(category);
CREATE INDEX IF NOT EXISTS idx_rewards_cost ON rewards(cost);

CREATE TABLE IF NOT EXISTS reward_redemptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reward_id TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  redeemed_at TEXT NOT NULL,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_date
  ON reward_redemptions(user_id, redeemed_at);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  accent TEXT NOT NULL,
  font_scale REAL NOT NULL,
  density TEXT NOT NULL,
  reduce_motion INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

export const SOFT_MIGRATIONS: readonly string[] = [
  'ALTER TABLE tasks ADD COLUMN scheduled_start_at TEXT',
  'ALTER TABLE users ADD COLUMN avatar_uri TEXT',
  'ALTER TABLE achievements ADD COLUMN is_custom INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN coins INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE achievements ADD COLUMN coin_reward INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN onboarding_completed_at TEXT',
];
