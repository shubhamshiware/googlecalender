import React, { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchText, clearFilters, setIsActive } from '../../store/slices/searchSlice';
import { useCalendar } from '../../context/CalendarContext';
import { useSearch } from '../../hooks/useSearch';
import { EventModal } from '../EventModal';
import type { Event } from '../../context/CalendarContext';

export const MobileSearchView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, updateEvent, deleteEvent, createEvent } = useCalendar();
  const { searchResults } = useSearch(events);
  const filters = useAppSelector((state) => state.search.filters);
  const [localText, setLocalText] = useState(filters.text);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLocalText(filters.text);
  }, [filters.text]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalText(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        dispatch(setSearchText(value));
        dispatch(setIsActive(true));
      }, 300);

      setDebounceTimer(timer);
    },
    [dispatch, debounceTimer]
  );

  const handleClear = () => {
    setLocalText('');
    dispatch(clearFilters());
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 pt-14 pb-16">
      <div className="sticky top-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={localText}
            onChange={handleInputChange}
            placeholder="Search events..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            autoFocus
          />
          {localText && (
            <button
              onClick={handleClear}
              className="px-3 py-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 rounded-lg text-gray-800 dark:text-white transition"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {localText && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {localText === '' ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Enter text to search events</p>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">No events found</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try a different search</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {searchResults.map((event) => {
              const startDate = new Date(event.start).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              const startTime = new Date(event.start).toLocaleTimeString('en-US', {
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
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                      {event.title}
                    </h3>
                    {event.category && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded whitespace-nowrap">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {startDate} • {startTime}
                  </p>

                  {event.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>
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
