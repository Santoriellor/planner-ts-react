import { CalendarEvent } from '../contexts/EventsContext.tsx';
import { isSameDay, differenceInCalendarWeeks, differenceInCalendarMonths, differenceInCalendarYears } from 'date-fns';

// Function to filter events based on repeat rules
export const filterEventsForDay = (
    calendarEvents: CalendarEvent[], 
    currentDate: Date
  ): CalendarEvent[] => {
    const isEventOnDay = (startDate: Date, repeatType: CalendarEvent['repeat']) => {
            switch (repeatType) {
                case 'no-repeat':
                    return isSameDay(currentDate, startDate);
                case 'daily':
                    return true;
                case 'weekly':
                    return (
                        differenceInCalendarWeeks(currentDate, startDate) >= 0 &&
                        currentDate.getDay() === startDate.getDay() // Same day of the week
                    );
                case 'two-weeks':
                    const weeksDiff = differenceInCalendarWeeks(currentDate, startDate);
                    return (
                        weeksDiff >= 0 &&
                        weeksDiff % 2 === 0 &&
                        currentDate.getDay() === startDate.getDay() // Same day of the week
                    );
                case 'monthly':
                    const monthsDiff = differenceInCalendarMonths(currentDate, startDate);
                    return (
                        monthsDiff >= 0 && 
                        monthsDiff % 1 === 0 && // Monthly repeat (every month)
                        currentDate.getDate() === startDate.getDate() // Same day of the month
                    );
                case 'yearly':
                    const yearsDiff = differenceInCalendarYears(currentDate, startDate);
                    return (
                        yearsDiff >= 0 && 
                        yearsDiff % 1 === 0 && // Yearly repeat (every year)
                        currentDate.getDate() === startDate.getDate() && // Same day of the year
                        currentDate.getMonth() === startDate.getMonth() // Same month
                    );
                default:
                    return false;
            }
    };
  
    return calendarEvents
        .filter((calendarEvent) => {
            // Check if `startingDate` is already a Date
            const startDate =
            calendarEvent.startingDate instanceof Date
                ? calendarEvent.startingDate
                : new Date(calendarEvent.startingDate);
            
            return isEventOnDay(startDate, calendarEvent.repeat ?? 'no-repeat');
            })
        .sort((a, b) => {
            // Sort by startingDate
            const timeA = new Date(a.startingDate).getTime();
            const timeB = new Date(b.startingDate).getTime();
            return timeA - timeB;
        });;
  };