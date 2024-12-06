import { filterEventsForDay } from '../utils/filterEvents';
import { CalendarEvent } from '../contexts/EventsContext';

// Extend CalendarEvent to include adjustedDate
interface AdjustedCalendarEvent extends CalendarEvent {
    adjustedDate?: Date;
}

export const getEventsForSpecificDay = (
  calendarEvents: CalendarEvent[],
  day: Date
): AdjustedCalendarEvent[] => {
  // Use the filterEventsForDay function for the specific day
  const eventsForDay = filterEventsForDay(calendarEvents, day).map((event) => ({
    ...event,
    adjustedDate: day, // Store the adjusted date as the current day
  }));

  // Sort events by time
  return eventsForDay.sort((a, b) => {
    const dateA = new Date(a.startingDate).getTime();
    const dateB = new Date(b.startingDate).getTime();
    return dateA - dateB;
  });
};