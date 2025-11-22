import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useReminders, type NotificationPayload } from '../hooks/useReminders';
import { showNotification, requestNotificationPermission as requestPermission } from '../utils/notification';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

interface ReminderContextType {
  messages: ToastMessage[];
  removeMessage: (id: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
  notificationPermission: NotificationPermission | 'not-requested';
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'not-requested'>(
    'not-requested'
  );

  useEffect(() => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setNotificationPermission(permission);
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestPermission();
    if (granted) {
      setNotificationPermission('granted');
    } else {
      setNotificationPermission('denied');
    }
    return granted;
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const handleReminder = useCallback(
    (notification: NotificationPayload) => {
      const id = `${notification.eventId}-${Date.now()}`;
      const newMessage: ToastMessage = {
        id,
        title: notification.title,
        message: notification.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);

      showNotification(notification.title, notification.message, {
        tag: notification.eventId,
        requireInteraction: false,
      }).catch((error) => {
        console.error('Failed to show notification:', error);
      });
    },
    []
  );

  useReminders(handleReminder);

  return (
    <ReminderContext.Provider
      value={{
        messages,
        removeMessage,
        requestNotificationPermission,
        notificationPermission,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder must be used within ReminderProvider');
  }
  return context;
};
