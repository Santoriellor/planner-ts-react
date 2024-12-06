import { format, addDays } from 'date-fns';

import './TomorrowsEvents.css';
import { getEventsForSpecificDay } from '../utils/specificDayEvents';

import { useCalendarEvents } from '../contexts/EventsContext';
import { usePeople } from '../contexts/PeopleContext';
import { useModalContext } from '../contexts/ModalContext';

const TodaysEvents = () => {
  const { calendarEvents } = useCalendarEvents();
  const { peopleConcerned, peopleResponsible } = usePeople();
  const { openModal } = useModalContext();

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const formattedDate = format(tomorrow, 'yyyy-MM-dd');

  // Filter events for the specific day
  const eventsTomorrow = getEventsForSpecificDay(calendarEvents, tomorrow);

  return (
    <div key={formattedDate} className="tomorrows-events">
      <p>Tomorrow</p>
      {eventsTomorrow.length > 0 ? (
      <ul>
      {eventsTomorrow.map((event) => {
        const eventStart = format(event.startingDate, 'HH:mm');
        const eventEnd = format(event.endingDate, 'HH:mm');
        return (<li key={event.id}>
          <button 
              onClick={() => openModal(event.startingDate, event)}
              className="tomorrows-events-button"
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
            {`${eventStart} - ${eventEnd}`}&nbsp;{event.title}&nbsp;
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
      ) : (
        <p>No events tomorrow</p>
      )}
    </div>
  )
}
export default TodaysEvents