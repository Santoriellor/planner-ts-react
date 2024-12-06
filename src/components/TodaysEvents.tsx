import { format } from 'date-fns';

import './TodaysEvents.css';
import { getEventsForSpecificDay } from '../utils/specificDayEvents';

import { useCalendarEvents } from '../contexts/EventsContext';
import { usePeople } from '../contexts/PeopleContext';
import { useModalContext } from '../contexts/ModalContext';

const TodaysEvents = () => {
  const { calendarEvents } = useCalendarEvents();
  const { peopleConcerned, peopleResponsible } = usePeople();
  const { openModal } = useModalContext();

  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');

  // Filter events for the specific day
  const eventsThisDay = getEventsForSpecificDay(calendarEvents, today);

  return (
    <div key={formattedDate} className="todays-events">
      <p>Today</p>
      {eventsThisDay.length > 0 ? (
      <ul>
      {eventsThisDay.map((event) => {
        const eventStart = format(event.startingDate, 'HH:mm');
        const eventEnd = format(event.endingDate, 'HH:mm');
        return (<li key={event.id}>
          <button 
              onClick={() => openModal(event.startingDate, event)}
              className="todays-events-button"
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
        <p>No events today</p>
      )}
    </div>
  )
}
export default TodaysEvents