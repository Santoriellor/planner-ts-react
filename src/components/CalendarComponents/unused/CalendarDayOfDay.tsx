import { format, isSameDay, getHours, getMinutes, differenceInMinutes, isAfter } from 'date-fns';

import './CalendarDayOfDay.css';
import HoverButton from './HoverButton';

import { useCalendarEvents, CalendarEvent } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { useModalContext } from '../../contexts/ModalContext';
import { useDateView } from '../../contexts/DateViewContext';

const CalendarDayOfDay = () => {
    const { currentDate } = useDateView();
    const { calendarEvents } = useCalendarEvents();
    const { peopleConcerned, peopleResponsible } = usePeople();
    const { openModal } = useModalContext();

    const today = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    // Filter events for the specific day
    const dayCalendarEvents = calendarEvents.filter((calendarEvent: CalendarEvent) => {
        const eventDate = format(calendarEvent.startingDate, 'yyyy-MM-dd');
        return eventDate === formattedDate;
    });

    const isToday = isSameDay(currentDate, today);

    // Calculate event duration
    const calculateEventDuration = (start: Date, end: Date) => {
        return differenceInMinutes(end, start); // Duration in minutes
    };

    // Detect overlapping events
    const groupOverlappingEvents = (events: CalendarEvent[]) => {
        const groupedEvents: CalendarEvent[][] = [];
        events.forEach((event) => {
            let placed = false;
            // Try to find a group where this event fits
            for (const group of groupedEvents) {
                const lastEventInGroup = group[group.length - 1];
                if (isAfter(event.startingDate, lastEventInGroup.endingDate)) {
                    group.push(event);
                    placed = true;
                    break;
                }
            }
            // If no group found, create a new one
            if (!placed) {
                groupedEvents.push([event]);
            }
        });
        return groupedEvents;
    };

    const groupedEvents = groupOverlappingEvents(dayCalendarEvents);

    return (
        <div key={formattedDate} className={`calendar-day-day ${isToday ? 'current-day-day' : ''}`}>
            <div className='calendar-day-day-grid'>
                {groupedEvents.map((eventGroup, groupIndex) => {
                    return eventGroup.map((calendarEvent, index) => {
                        // Calculate the position and width for the event
                        const eventDurationMinutes = calculateEventDuration(calendarEvent.startingDate, calendarEvent.endingDate);
                        const eventStartMinutes = getHours(calendarEvent.startingDate) * 60 + getMinutes(calendarEvent.startingDate);
                        const eventWidth = 100 / groupedEvents.length; // Divide width by number of overlapping groups
                        const overlapOffset = groupIndex * eventWidth; // Adjust the left offset based on group index

                        return (
                            <div
                                key={index}
                                className="calendar-day-event"
                                style={{
                                    position: 'absolute',
                                    top: `${(eventStartMinutes / 1440) * 100}%`, // Adjust based on hour and minutes
                                    left: `${overlapOffset}%`,
                                    minHeight: `${(eventDurationMinutes / 1440) * 100}%`, // Adjust height based on duration
                                    width: `${eventWidth}%`, // Adjust width to avoid overlap
                                }}
                            >
                                <button 
                                    onClick={() => openModal(calendarEvent.startingDate, calendarEvent)}
                                    className="calendar-day-event-button"
                                >
                                    <div className="people-pics">
                                        {calendarEvent.whoIsConcerned?.map((personId) => {
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
                                    &nbsp;{calendarEvent.title}&nbsp;
                                    <div className="people-pics">
                                        {calendarEvent.doneBy?.map((personId) => {
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
                            </div>
                        );
                    });
                })}
            </div>
            <ul className='calendar-day-day-hours'>
                {Array.from({ length: 24 }, (_, hour) => (
                    <li key={hour} className='hour-block'>
                        <HoverButton day={currentDate} hour={hour} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CalendarDayOfDay;
