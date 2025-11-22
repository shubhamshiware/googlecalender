import React, { useEffect } from 'react';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

interface NotificationToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ messages, onRemove }) => {
  const TOAST_DURATION = 6000;

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const timer = setTimeout(() => {
      onRemove(latestMessage.id);
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [messages, onRemove]);

  if (messages.length === 0) return null;

  const latestMessage = messages[messages.length - 1];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{latestMessage.title}</h3>
            <p className="text-sm opacity-90">{latestMessage.message}</p>
          </div>
          <button
            onClick={() => onRemove(latestMessage.id)}
            className="ml-2 text-white hover:opacity-75 flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
