import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useSearch } from '../../hooks/useSearch';
import { EventModal } from '../EventModal';
import type { Event } from '../../context/CalendarContext';

interface MobileCalendarViewProps {
  viewType: 'week' | 'month';
  startDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export const MobileCalendarView: React.FC<MobileCalendarViewProps> = ({
  viewType,
  startDate,
  onPrevious,
  onNext,
}) => {
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();
  const { searchResults, isSearchActive } = useSearch(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayedEvents = isSearchActive ? searchResults : events;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (eventData: Omit<Event, '_id' | 'userId'>) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent._id, eventData);
    } else {
      await createEvent(eventData);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    handleCloseModal();
  };

  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const renderWeekView = () => {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    const monthLabel = startDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    return (
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 pt-14 pb-16">
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sticky top-14">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              aria-label="Previous week"
            >
              ←
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">{monthLabel}</span>
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              aria-label="Next week"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 p-3">
          {days.map((day, idx) => {
            const dayLabel = day.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'numeric',
              day: 'numeric',
            });

            const dayEvents = displayedEvents.filter((event) => {
              const eventDate = new Date(event.start).toDateString();
              const dayStr = day.toDateString();
              return eventDate === dayStr;
            });

            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-800 rounded-lg overflow-hidden border-l-4 ${
                  isToday
                    ? 'border-l-blue-600 ring-2 ring-blue-200 dark:ring-blue-900'
                    : 'border-l-gray-300 dark:border-l-slate-700'
                }`}
              >
                <div
                  className={`px-4 py-2 ${
                    isToday
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'bg-gray-50 dark:bg-slate-900'
                  }`}
                >
                  <p
                    className={`font-semibold text-sm ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {dayLabel}
                  </p>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1 p-2">
                  {dayEvents.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500 py-2">No events</p>
                  ) : (
                    dayEvents.map((event) => {
                      const startTime = new Date(event.start).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      });

                      return (
                        <div
                          key={event._id}
                          onClick={() => handleEventClick(event)}
                          className="text-xs p-2 rounded cursor-pointer transition hover:shadow-md active:scale-95 truncate"
                          style={{
                            backgroundColor: event.color || '#3B82F6',
                            color: 'white',
                          }}
                          title={event.title}
                        >
                          <p className="font-medium truncate">{startTime}</p>
                          <p className="truncate">{event.title}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = getMonthStart(startDate);
    const monthEnd = getMonthEnd(startDate);

    const startDate_ = new Date(monthStart);
    startDate_.setDate(startDate_.getDate() - startDate_.getDay());

    const days = [];
    const current = new Date(startDate_);
    while (current <= monthEnd || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const monthLabel = startDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 pt-14 pb-16 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sticky top-14">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              aria-label="Previous month"
            >
              ←
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">{monthLabel}</span>
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 gap-1 p-2 h-full">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-1"
              >
                {day}
              </div>
            ))}

            {days.map((day, idx) => {
              const dayEvents = displayedEvents.filter((event) => {
                const eventDate = new Date(event.start).toDateString();
                const dayStr = day.toDateString();
                return eventDate === dayStr;
              });

              const isToday = new Date().toDateString() === day.toDateString();
              const isCurrentMonth = day.getMonth() === startDate.getMonth();

              return (
                <div
                  key={idx}
                  className={`min-h-16 border rounded text-xs p-1 cursor-pointer transition hover:shadow-md ${
                    isToday
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600'
                      : isCurrentMonth
                      ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                      : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <p
                    className={`font-semibold mb-1 ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-300'
                        : isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    {day.getDate()}
                  </p>
                  <div className="space-y-0.5 max-h-10 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        className="text-xs font-medium px-1 py-0.5 rounded truncate text-white"
                        style={{
                          backgroundColor: event.color || '#3B82F6',
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs px-1">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewType === 'week' ? renderWeekView() : renderMonthView()}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  );
};
