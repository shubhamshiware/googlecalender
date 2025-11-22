export interface NotificationOptions {
  tag?: string;
  requireInteraction?: boolean;
  icon?: string;
}

export const showNotification = async (
  title: string,
  body: string,
  options: NotificationOptions = {}
): Promise<void> => {
  if (!('Notification' in window)) {
    console.warn('Notifications are not supported in this browser');
    return;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag || undefined,
        requireInteraction: options.requireInteraction ?? false,
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag || undefined,
        requireInteraction: options.requireInteraction ?? false,
      });
    }
  } catch (error) {
    console.error('Failed to request notification permission:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};
