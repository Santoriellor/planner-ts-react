import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Define the type for an event
export type CalendarEvent = {
  id: string;
  title: string;
  startingDate: Date;
  endingDate: Date;
  description?: string;
  location?: string;
  whoIsConcerned?: string[];
  doneBy?: string[];
  wholeDay?: boolean;
  repeat?: 'no-repeat' | 'daily' | 'weekly' | 'two-weeks' | 'monthly' | 'yearly';
};

// Define the context type
interface CalendarEventsContextType {
  calendarEvents: CalendarEvent[];
  fetchCalendarEvents: () => void;
  addCalendarEvent: (calendarEvent: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  editCalendarEvent: (id: string, updatedCalendarEvent: CalendarEvent) => void;
}

// Create the context with the defined type
const CalendarEventsContext = createContext<CalendarEventsContextType | undefined>(undefined);

// Custom hook to use the CalendarEventsContext
export const useCalendarEvents = (): CalendarEventsContextType => {
  const context = useContext(CalendarEventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

// Define the provider's props
interface CalendarEventsProviderProps {
  children: ReactNode;
}

// The provider component
export const CalendarEventsProvider = ({ children }: CalendarEventsProviderProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Fetch events from db.json using axios
  const fetchCalendarEvents = async () => {
    try {
      const response = await axios.get<CalendarEvent[]>('http://localhost:3001/events');
      // Assuming the 'date' is returned as an ISO string, convert to Date objects
      const fetchedCalendarEvents = response.data.map((calendarEvent) => ({
        ...calendarEvent,
        startingDate: new Date(calendarEvent.startingDate),
      }));
      setCalendarEvents(fetchedCalendarEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Add a new event to the events array
  const addCalendarEvent = (newCalendarEvent: CalendarEvent) => {
    axios.post('http://localhost:3001/events', newCalendarEvent)
      .then((response) => {
        setCalendarEvents((prevCalendarEvents) => [...prevCalendarEvents, response.data]);
        console.log('Event added successfully:', response);
      })
      .catch(error => console.error('Failed to add event:', error));
  };

  // Delete an event by ID
  const deleteCalendarEvent = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`);
      setCalendarEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      console.log(`Event with id ${id} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  // Modify an existing event
  const editCalendarEvent = async (id: string, updatedCalendarEvent: CalendarEvent) => {
    try {
      const response = await axios.put(`http://localhost:3001/events/${id}`, updatedCalendarEvent);
      setCalendarEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === id ? response.data : event))
      );
      console.log(`Event with id ${id} updated successfully`);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  return (
    <CalendarEventsContext.Provider value={{ calendarEvents, fetchCalendarEvents, addCalendarEvent, deleteCalendarEvent, editCalendarEvent }}>
      {children}
    </CalendarEventsContext.Provider>
  );
};
