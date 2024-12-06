import { format, addDays } from 'date-fns';

import './UpcomingWeeksEvents.css';
import { getWeekEvents } from '../utils/nextWeekEvents';

import { useCalendarEvents, CalendarEvent } from '../contexts/EventsContext';
import { usePeople } from '../contexts/PeopleContext';
import { useModalContext } from '../contexts/ModalContext';

// Extend CalendarEvent to include adjustedDate
interface AdjustedCalendarEvent extends CalendarEvent {
  adjustedDate?: Date;
}

const UpcomingWeeksEvents = () => {
  const { calendarEvents } = useCalendarEvents();
  const { peopleConcerned, peopleResponsible } = usePeople();
  const { openModal } = useModalContext();

  // Get today's date
  const today = new Date();

  // Calculate the start of the upcoming week
  const startOfRange = addDays(today, 2); // Day after tomorrow

  const weekCalendarEvents = getWeekEvents(calendarEvents, startOfRange);

  // Group events by day
  const eventsByDay = weekCalendarEvents.reduce((acc: { [key: string]: AdjustedCalendarEvent[] }, event: AdjustedCalendarEvent) => {
    const eventDate = format(event.adjustedDate!, 'yyyy-MM-dd');
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  return (
    <div className="nextweek-events">
      {Object.keys(eventsByDay).map((day) => (
        <div key={day}>
          <p>{format(new Date(day), 'EEEE, MMMM d')}</p>
          <ul>
            {eventsByDay[day].map((event) => {
              return (
                <li key={event.id}>
                  <button 
              onClick={() => openModal(event.startingDate, event)}
              className="nextweek-events-button"
          >
            <div className="people-pics">
                {event.whoIsConcerned?.map((personId) => {
                    const person = peopleConcerned.find((p) => p.id === personId);
                    return person ? (
                        <img
                            key={person.id}
                            src={person.picture}
                            alt={person.name}
                            title={person.name}
                            className="person-pic"
                            style={{ width: '20px', borderRadius: '50%' }}
                        />
                    ) : null;
                })}
            </div>
            &nbsp;{event.title}&nbsp;
            <div className="people-pics">
                {event.doneBy?.map((personId) => {
                    const person = peopleResponsible.find((p) => p.id === personId);
                    return person ? (
                        <img
                            key={person.id}
                            src={person.picture}
                            alt={person.name}
                            title={person.name}
                            className="person-pic"
                            style={{ width: '20px', borderRadius: '50%' }}
                        />
                    ) : null;
                })}
            </div>
          </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default UpcomingWeeksEvents;
