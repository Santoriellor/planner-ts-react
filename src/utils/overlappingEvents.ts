import { CalendarEvent } from '../contexts/EventsContext.tsx';

export const groupOverlappingEvents = (events: CalendarEvent[]) => {
    const groups: CalendarEvent[][] = [];

  events.forEach((event) => {
    let added = false;

    // Check each group for overlap based on time
    for (const group of groups) {
      if (group.some((groupEvent) => isOverlapping(event, groupEvent))) {
        group.push(event); // Add event to this group
        added = true;
        break;
      }
    }

    // If no overlapping group was found, create a new group
    if (!added) {
      groups.push([event]);
    }
  });

  return groups;
};

function isOverlapping(eventA: CalendarEvent, eventB: CalendarEvent): boolean {
    const startA = getTimeOfDay(eventA.startingDate);
    const endA = getTimeOfDay(eventA.endingDate);
    const startB = getTimeOfDay(eventB.startingDate);
    const endB = getTimeOfDay(eventB.endingDate);
  
    // Check if time ranges overlap
    return startA < endB && startB < endA;
  };
  
  // Helper function to extract time part as milliseconds since midnight
  function getTimeOfDay(dateString: Date): number {
    const date = new Date(dateString);
    return date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000;
  };