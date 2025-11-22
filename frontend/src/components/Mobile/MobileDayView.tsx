import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useSearch } from '../../hooks/useSearch';
import { EventModal } from '../EventModal';
import type { Event } from '../../context/CalendarContext';

interface MobileDayViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const MobileDayView: React.FC<MobileDayViewProps> = ({ selectedDate, onDateChange }) => {
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();
  const { searchResults, isSearchActive } = useSearch(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayedEvents = isSearchActive ? searchResults : events;

  const dayEvents = displayedEvents.filter((event) => {
    const eventDate = new Date(event.start).toDateString();
    const selectedDateStr = selectedDate.toDateString();
    return eventDate === selectedDateStr;
  });

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

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

  const sortedEvents = dayEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const dateStr = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const isToday = new Date().toDateString() === selectedDate.toDateString();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 pt-14 pb-16">
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sticky top-14">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            aria-label="Previous day"
          >
            ←
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{dateStr}</h2>
            {isToday && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Today</p>
            )}
          </div>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            aria-label="Next day"
          >
            →
          </button>
        </div>
        <button
          onClick={handleToday}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
        >
          Go to Today
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No events scheduled</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Tap the + button to create an event
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {sortedEvents.map((event) => {
              const startTime = new Date(event.start).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              const endTime = new Date(event.end).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={event._id}
                  onClick={() => handleEventClick(event)}
                  className="bg-white dark:bg-slate-800 border-l-4 rounded-lg p-4 cursor-pointer transition transform hover:scale-105 active:scale-95"
                  style={{
                    borderLeftColor: event.color || '#3B82F6',
                  }}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {startTime} - {endTime}
                  </p>
                  {event.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {event.category && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded">
                        {event.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};
