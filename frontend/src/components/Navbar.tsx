import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useReminder } from '../context/ReminderContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { requestNotificationPermission, notificationPermission } = useReminder();
  const [notificationLoading, setNotificationLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRequestNotifications = async () => {
    setNotificationLoading(true);
    await requestNotificationPermission();
    setNotificationLoading(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Google Calendar
            </h1>
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => navigate('/week')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Week
              </button>
              <button
                onClick={() => navigate('/month')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Month
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
              title="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {user && notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestNotifications}
                disabled={notificationLoading}
                className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition disabled:opacity-50"
                title="Enable notifications for event reminders"
              >
                {notificationLoading ? '...' : '🔔'}
              </button>
            )}

            {user && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
