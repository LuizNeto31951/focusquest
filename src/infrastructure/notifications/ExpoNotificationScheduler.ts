import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  AndroidNotificationPriority,
  SchedulableTriggerInputTypes,
} from 'expo-notifications';
import type { UniqueId } from '@/shared/types';
import type { Task } from '@/domain/entities';
import type { Weekday } from '@/domain/value-objects';
import type { NotificationScheduler } from '@/application/ports';
import type { TaskNotificationRepository } from '@/domain/repositories';

const CUSTOM_OCCURRENCES_AHEAD = 20;
const DAY_MS = 24 * 60 * 60 * 1000;
const ANDROID_CHANNEL_ID = 'task-reminders';

export class ExpoNotificationScheduler implements NotificationScheduler {
  private channelReady: Promise<void> | null = null;

  constructor(private readonly linkRepository: TaskNotificationRepository) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      this.channelReady = this.setupAndroidChannel();
    }
  }

  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Lembretes de tarefas',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableLights: true,
      enableVibrate: true,
      showBadge: false,
    });
  }

  async requestPermissions(): Promise<boolean> {
    if (this.channelReady) await this.channelReady;
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const result = await Notifications.requestPermissionsAsync();
    return result.granted;
  }

  async cancelForTask(taskId: UniqueId): Promise<void> {
    const existing = await this.linkRepository.findByTask(taskId);
    await Promise.all(
      existing.map((link) =>
        Notifications.cancelScheduledNotificationAsync(
          link.notificationId,
        ).catch(() => undefined),
      ),
    );
    await this.linkRepository.deleteByTask(taskId);
  }

  async scheduleForTask(task: Task): Promise<void> {
    if (this.channelReady) await this.channelReady;
    await this.cancelForTask(task.id);
    if (!task.scheduledStartAt) return;

    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) return;

    const start = new Date(task.scheduledStartAt);
    const content: Notifications.NotificationContentInput = {
      title: task.title,
      body: 'Hora de começar esta tarefa.',
      data: { taskId: task.id },
      priority: AndroidNotificationPriority.HIGH,
      sound: 'default',
    };

    const scheduleAndStore = async (
      trigger: Notifications.NotificationTriggerInput,
    ): Promise<void> => {
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });
      await this.linkRepository.save({
        taskId: task.id,
        notificationId: id,
      });
    };

    if (!task.isRecurring || !task.recurrenceRule) {
      const target = nextOccurrenceFromTime(start);
      await scheduleAndStore({
        type: SchedulableTriggerInputTypes.DATE,
        date: target,
        channelId: ANDROID_CHANNEL_ID,
      });
      return;
    }

    const hour = start.getHours();
    const minute = start.getMinutes();
    const rule = task.recurrenceRule;

    if (rule.frequency === 'DAILY') {
      await scheduleAndStore({
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: ANDROID_CHANNEL_ID,
      });
      return;
    }

    if (rule.frequency === 'WEEKLY') {
      for (const day of rule.weekdays) {
        await scheduleAndStore({
          type: SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekdayToExpo(day),
          hour,
          minute,
          channelId: ANDROID_CHANNEL_ID,
        });
      }
      return;
    }

    if (rule.frequency === 'CUSTOM') {
      const interval = rule.intervalDays;
      const createdAt = new Date(task.createdAt);
      let next = new Date(createdAt);
      next.setHours(hour, minute, 0, 0);
      while (next.getTime() <= Date.now()) {
        next = new Date(next.getTime() + interval * DAY_MS);
      }
      for (let i = 0; i < CUSTOM_OCCURRENCES_AHEAD; i++) {
        await scheduleAndStore({
          type: SchedulableTriggerInputTypes.DATE,
          date: new Date(next),
          channelId: ANDROID_CHANNEL_ID,
        });
        next = new Date(next.getTime() + interval * DAY_MS);
      }
    }
  }
}

function weekdayToExpo(weekday: Weekday): number {
  return weekday + 1;
}

function nextOccurrenceFromTime(source: Date): Date {
  const target = new Date();
  target.setHours(source.getHours(), source.getMinutes(), 0, 0);
  if (target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}
