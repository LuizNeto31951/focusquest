import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import type { UniqueId } from '@/shared/types';
import type { Task } from '@/domain/entities';
import type { Weekday } from '@/domain/value-objects';
import type { NotificationScheduler } from '@/application/ports';
import type { TaskNotificationRepository } from '@/domain/repositories';

const CUSTOM_OCCURRENCES_AHEAD = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

export class ExpoNotificationScheduler implements NotificationScheduler {
  constructor(private readonly linkRepository: TaskNotificationRepository) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async requestPermissions(): Promise<boolean> {
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
    await this.cancelForTask(task.id);
    if (!task.scheduledStartAt) return;

    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) return;

    const start = new Date(task.scheduledStartAt);
    const content: Notifications.NotificationContentInput = {
      title: task.title,
      body: 'Hora de começar esta tarefa.',
      data: { taskId: task.id },
    };

    if (!task.isRecurring || !task.recurrenceRule) {
      if (start.getTime() <= Date.now()) return;
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: start,
        },
      });
      await this.linkRepository.save({
        taskId: task.id,
        notificationId: id,
      });
      return;
    }

    const hour = start.getHours();
    const minute = start.getMinutes();
    const rule = task.recurrenceRule;

    if (rule.frequency === 'DAILY') {
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      await this.linkRepository.save({
        taskId: task.id,
        notificationId: id,
      });
      return;
    }

    if (rule.frequency === 'WEEKLY') {
      for (const day of rule.weekdays) {
        const id = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekdayToExpo(day),
            hour,
            minute,
          },
        });
        await this.linkRepository.save({
          taskId: task.id,
          notificationId: id,
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
        const id = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: new Date(next),
          },
        });
        await this.linkRepository.save({
          taskId: task.id,
          notificationId: id,
        });
        next = new Date(next.getTime() + interval * DAY_MS);
      }
    }
  }
}

function weekdayToExpo(weekday: Weekday): number {
  return weekday + 1;
}
