import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, title }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 z-40 md:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">{title}</h1>

      <button
        onClick={toggleTheme}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};
