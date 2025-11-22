import React, { useState } from 'react';
import { getMonthStart, getMonthEnd, isToday, isSameDay } from '../utils/dateHelpers';

interface SidebarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = getMonthStart(currentMonth);
  const monthEnd = getMonthEnd(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const current = new Date(startDate);
  while (current <= monthEnd || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const today = () => {
    const now = new Date();
    setCurrentMonth(now);
    onDateSelect(now);
  };

  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-4">
      <div className="mb-6">
        <button
          onClick={today}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mb-4"
        >
          Today
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
            ←
          </button>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}

          {days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => onDateSelect(day)}
              className={`p-2 text-xs rounded transition ${
                isSameDay(day, selectedDate)
                  ? 'bg-blue-600 text-white font-bold'
                  : isToday(day)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold'
                  : day.getMonth() !== currentMonth.getMonth()
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
