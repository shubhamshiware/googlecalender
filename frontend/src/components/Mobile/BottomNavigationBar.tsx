import React from 'react';

interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  activeTab: string;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ items, activeTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-around items-center md:hidden z-40">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center flex-1 py-2 transition ${
            activeTab === item.id
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-label={item.label}
        >
          <span className="text-xl mb-1">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
