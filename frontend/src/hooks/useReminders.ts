import { useEffect, useRef, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../context/CalendarContext';

export interface NotificationPayload {
  title: string;
  message: string;
  eventId: string;
}

interface ReminderCallback {
  (notification: NotificationPayload): void;
}

interface ScheduledReminder {
  timeoutId: ReturnType<typeof setTimeout>;
  eventId: string;
  startTime: number;
}

export const useReminders = (onReminder: ReminderCallback) => {
  const { events } = useCalendar();
  const { token } = useAuth();
  const remindersRef = useRef<Map<string, ScheduledReminder>>(new Map());
  const firedRemindersRef = useRef<Set<string>>(new Set());

  const REMINDER_TIME_MINUTES = 5;
  const REMINDER_TIME_MS = REMINDER_TIME_MINUTES * 60 * 1000;

  const getEventKey = useCallback((eventId: string, startTime: number): string => {
    return `${eventId}-${startTime}`;
  }, []);

  const calculateReminderTime = useCallback((event: Event): { reminderTime: Date; shouldRemind: boolean } => {
    const now = new Date();
    const eventStartTime = new Date(event.start);
    const reminderTime = new Date(eventStartTime.getTime() - REMINDER_TIME_MS);

    if (eventStartTime <= now) {
      return { reminderTime, shouldRemind: false };
    }

    if (reminderTime > now) {
      return { reminderTime, shouldRemind: true };
    }

    if (eventStartTime > now && reminderTime <= now) {
      return { reminderTime, shouldRemind: true };
    }

    return { reminderTime, shouldRemind: false };
  }, [REMINDER_TIME_MS]);

  const scheduleReminder = useCallback(
    (event: Event) => {
      if (!token || !event._id || !event.start) return;

      const eventKey = getEventKey(event._id, new Date(event.start).getTime());

      if (remindersRef.current.has(eventKey)) {
        return;
      }

      if (firedRemindersRef.current.has(eventKey)) {
        return;
      }

      const { reminderTime, shouldRemind } = calculateReminderTime(event);

      if (!shouldRemind) return;

      const now = new Date();
      const timeUntilReminder = Math.max(0, reminderTime.getTime() - now.getTime());

      const timeoutId = setTimeout(() => {
        onReminder({
          title: 'Upcoming Event',
          message: `${event.title} starts in 5 minutes`,
          eventId: event._id,
        });

        firedRemindersRef.current.add(eventKey);

        remindersRef.current.delete(eventKey);
      }, timeUntilReminder);

      remindersRef.current.set(eventKey, {
        timeoutId,
        eventId: event._id,
        startTime: new Date(event.start).getTime(),
      });
    },
    [token, getEventKey, calculateReminderTime, onReminder]
  );

  useEffect(() => {
    if (!token) {
      remindersRef.current.forEach((reminder) => clearTimeout(reminder.timeoutId));
      remindersRef.current.clear();
      firedRemindersRef.current.clear();
      return;
    }

    events.forEach((event) => {
      scheduleReminder(event);
    });

    return () => {
      remindersRef.current.forEach((reminder) => clearTimeout(reminder.timeoutId));
      remindersRef.current.clear();
    };
  }, [events, token, scheduleReminder]);

  const clearReminders = useCallback(() => {
    remindersRef.current.forEach((reminder) => clearTimeout(reminder.timeoutId));
    remindersRef.current.clear();
    firedRemindersRef.current.clear();
  }, []);

  return {
    clearReminders,
  };
};
