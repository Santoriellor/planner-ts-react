import { addDays } from 'date-fns';


import { filterEventsForDay } from '../utils/filterEvents';
import { CalendarEvent } from '../contexts/EventsContext';

// Extend CalendarEvent to include adjustedDate
interface AdjustedCalendarEvent extends CalendarEvent {
    adjustedDate?: Date;
}

export const getWeekEvents = (
  calendarEvents: CalendarEvent[],
  startDate: Date,
  daysInWeek: number = 7
): AdjustedCalendarEvent[] => {
  const eventsForWeek: AdjustedCalendarEvent[] = [];

  // Loop through each day in the range
  for (let i = 0; i < daysInWeek; i++) {
    const currentDay = addDays(startDate, i);

    // Use the filterEventsForDay function to get events for the current day
    const eventsForDay = filterEventsForDay(calendarEvents, currentDay).map((event) => {
      // Clone the event and replace the startingDate with the current day
      return {
        ...event,
        adjustedDate: currentDay,
      };
    });

    // Merge the daily events into the weekly events array
    eventsForWeek.push(...eventsForDay);
  }

  // Remove duplicates if needed (e.g., in case of overlapping events)
  const uniqueEvents = Array.from(
    new Set(eventsForWeek.map((event) => event.id + event.adjustedDate))
  ).map((key) =>
    eventsForWeek.find(
      (event) => event.id + event.adjustedDate === key
    )!
  );

  // Sort by adjusted date
  return uniqueEvents.sort((a, b) => {
    const dateA = new Date(a.adjustedDate!);
    const dateB = new Date(b.adjustedDate!);
    return dateA.getTime() - dateB.getTime();
  });
};
