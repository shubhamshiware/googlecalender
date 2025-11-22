import React, { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Event } from '../context/CalendarContext';
import { getWeekDays, getDayName, formatDate } from '../utils/dateHelpers';
import { getTimeInMinutes } from '../utils/timeHelpers';
import { HOURS } from '../utils/constants';
import { EventModal } from './EventModal';
import { SearchHeader } from './SearchHeader';
import { useSearch } from '../hooks/useSearch';

interface WeekViewProps {
  startDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ startDate, onPrevWeek, onNextWeek }) => {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent } = useCalendar();
  const { searchResults } = useSearch(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [newEventStart, setNewEventStart] = useState<Date | null>(null);

  const displayEvents = searchResults;
  const weekDays = getWeekDays(startDate);

  useEffect(() => {
    const weekStart = new Date(weekDays[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekDays[6]);
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

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1);
    setNewEventStart(start);
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleEventDragStart = (e: React.DragEvent, event: Event) => {
    e.stopPropagation();
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    if (draggedEvent) {
      const newStart = new Date(day);
      newStart.setHours(hour, draggedEvent.start.getMinutes());
      const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
      const newEnd = new Date(newStart.getTime() + duration);

      updateEvent(draggedEvent._id, {
        start: newStart,
        end: newEnd,
      });
      setDraggedEvent(null);
    }
  };

  const handleSaveEvent = async (event: Omit<Event, '_id' | 'userId'>) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent._id, event);
    } else {
      await createEvent(event);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
  };

  const currentHour = new Date().getHours();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={onPrevWeek}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded"
        >
          ← Previous
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </h2>
        <button
          onClick={onNextWeek}
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

      <div className="flex-1 overflow-x-auto">
        <div className="calendar-grid" style={{ gridTemplateColumns: 'auto repeat(7, 1fr)' }}>
          <div className="w-20 bg-gray-50 dark:bg-slate-800" />
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 dark:border-slate-700 p-2 text-center bg-gray-50 dark:bg-slate-800"
            >
              <div className="font-semibold text-gray-900 dark:text-white">{getDayName(day)}</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{day.getDate()}</div>
            </div>
          ))}

          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="w-20 p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700 font-semibold">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {weekDays.map((day, dayIdx) => (
                <div
                  key={`${hour}-${dayIdx}`}
                  onClick={() => handleTimeSlotClick(day, hour)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day, hour)}
                  className="calendar-time-slot relative h-20 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                  style={{
                    backgroundColor:
                      currentHour === hour && getWeekDays(new Date())[dayIdx].getDate() === day.getDate()
                        ? 'rgba(59, 130, 246, 0.05)'
                        : undefined,
                  }}
                >
                  {currentHour === hour &&
                    getWeekDays(new Date())[dayIdx].getDate() === day.getDate() && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500" />
                    )}

                  {getEventsForDay(day)
                    .filter((event) => event.start.getHours() === hour)
                    .map((event) => {
                      const topHour = getTimeInMinutes(event.start) / 60;
                      const topOffset = (topHour % 1) * 80;
                      const heightHours =
                        (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);

                      return (
                        <div
                          key={event._id}
                          draggable
                          onDragStart={(e) => handleEventDragStart(e, event)}
                          onClick={(e) => handleEventClick(e, event)}
                          className="calendar-event cursor-move"
                          style={{
                            backgroundColor: event.color,
                            top: `${topOffset}px`,
                            height: `${Math.max(20, heightHours * 80)}px`,
                            left: '2px',
                            right: '2px',
                          }}
                        >
                          <div className="truncate text-xs font-semibold">{event.title}</div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <EventModal
        isOpen={showModal}
        event={selectedEvent}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
          setNewEventStart(null);
        }}
        onSave={async (event) => {
          await handleSaveEvent(
            newEventStart
              ? {
                  ...event,
                  start: newEventStart,
                  end: new Date(newEventStart.getTime() + 3600000),
                }
              : event
          );
        }}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};
