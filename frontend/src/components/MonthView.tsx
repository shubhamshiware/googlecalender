import React, { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Event } from '../context/CalendarContext';
import { getMonthStart, getMonthEnd, isToday, getMonthName } from '../utils/dateHelpers';
import { EventModal } from './EventModal';
import { SearchHeader } from './SearchHeader';
import { useSearch } from '../hooks/useSearch';

interface MonthViewProps {
  startDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ startDate, onPrevMonth, onNextMonth }) => {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent } = useCalendar();
  const { searchResults } = useSearch(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const displayEvents = searchResults;

  const monthStart = getMonthStart(startDate);
  const monthEnd = getMonthEnd(startDate);
  const startDate_ = new Date(monthStart);
  startDate_.setDate(startDate_.getDate() - startDate_.getDay());

  const days: Date[] = [];
  const current = new Date(startDate_);
  while (current <= monthEnd || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  useEffect(() => {
    const weekStart = new Date(days[0]);
    weekStart.setHours(0, 0, 0, 0);
    const lastDay = days[days.length - 1];
    const weekEnd = new Date(lastDay);
    weekEnd.setHours(23, 59, 59, 999);
    fetchEvents(weekStart, weekEnd);
  }, [startDate, fetchEvents]);

  const getEventsForDay = (day: Date) => {
    return displayEvents.filter((event) => {
      const eventDay = new Date(event.start);
      return (
        eventDay.getDate() === day.getDate() &&
        eventDay.getMonth() === day.getMonth() &&
        eventDay.getFullYear() === day.getFullYear()
      );
    });
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(null);
    setShowModal(true);
  };

  const handleSaveEvent = async (event: Omit<Event, '_id' | 'userId'>) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent._id, event);
    } else if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(event.start.getHours());
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      await createEvent({
        ...event,
        start,
        end,
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={onPrevMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded"
        >
          ← Previous
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {getMonthName(startDate)} {startDate.getFullYear()}
        </h2>
        <button
          onClick={onNextMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded"
        >
          Next →
        </button>
      </div>

      <SearchHeader
        onSearch={() => {}}
        onFiltersChange={() => {}}
        resultCount={displayEvents.length}
      />

      <div className="flex-1 overflow-auto">
        <div className="calendar-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700"
            >
              {day}
            </div>
          ))}

          {days.map((day, idx) => (
            <div
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`calendar-time-slot min-h-32 p-2 cursor-pointer ${
                day.getMonth() !== startDate.getMonth()
                  ? 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-600'
                  : 'bg-white dark:bg-slate-900'
              } ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            >
              <div
                className={`text-sm font-semibold mb-1 ${
                  isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {getEventsForDay(day).slice(0, 2).map((event) => (
                  <div
                    key={event._id}
                    onClick={(e) => handleEventClick(e, event)}
                    className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
                {getEventsForDay(day).length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    +{getEventsForDay(day).length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EventModal
        isOpen={showModal}
        event={selectedEvent}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};
