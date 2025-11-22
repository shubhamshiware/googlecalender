import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

export interface Event {
  _id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  category: 'Work' | 'Personal' | 'Other';
  userId: string;
}

interface CalendarContextType {
  events: Event[];
  loading: boolean;
  fetchEvents: (start: Date, end: Date) => Promise<void>;
  createEvent: (event: Omit<Event, '_id' | 'userId'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  darkMode?: never;
  toggleDarkMode?: never;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const fetchEvents = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events`, {
        params: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data.events.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      })));
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const createEvent = useCallback(async (event: Omit<Event, '_id' | 'userId'>) => {
    try {
      await axios.post(`${API_URL}/events`, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      await fetchEvents(startOfWeek, endOfWeek);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }, [token, API_URL, fetchEvents]);

  const updateEvent = useCallback(async (id: string, event: Partial<Event>) => {
    try {
      await axios.put(`${API_URL}/events/${id}`, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      await fetchEvents(startOfWeek, endOfWeek);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [token, API_URL, fetchEvents]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      await fetchEvents(startOfWeek, endOfWeek);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [token, API_URL, fetchEvents]);

  return (
    <CalendarContext.Provider
      value={{
        events,
        loading,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};
