import { format, isSameDay, getHours, getMinutes, differenceInMinutes, isAfter } from 'date-fns';

import './CalendarDayOfWeek.css';
import HoverButton from './HoverButton';

import { useCalendarEvents, CalendarEvent } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { useModalContext } from '../../contexts/ModalContext';

type CalendarDayOfWeekProps = {
    day: Date,
}

const CalendarDayOfWeek = ({ day }: CalendarDayOfWeekProps) => {
    const { calendarEvents } = useCalendarEvents();
    const { peopleConcerned, peopleResponsible } = usePeople();
    const { openModal } = useModalContext();

    const today = new Date();
    const formattedDate = format(day, 'yyyy-MM-dd');

    // Filter events for the specific day
    const dayCalendarEvents = calendarEvents.filter((calendarEvent: CalendarEvent) => {
        const eventDate = format(calendarEvent.startingDate, 'yyyy-MM-dd');
        return eventDate === formattedDate;
    });

    const isToday = isSameDay(day, today);

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
        <div key={formattedDate} className={`calendar-week-day ${isToday ? 'current-week-day' : ''}`}>
            <div>
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
                                    className="calendar-week-event-button"
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
                                    {calendarEvent.title}
                                    <div className="people-images">
                                        {calendarEvent.doneBy?.map((personId) => {
                                            const person = peopleResponsible.find((p) => p.id === personId);
                                            return person ? (
                                                <img
                                                    key={person.id}
                                                    src={person.picture}
                                                    alt={person.name}
                                                    className="person-image"
                                                    style={{ width: '15px', borderRadius: '50%' }}
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
            <ul className="calendar-week-day-hours">
                {Array.from({ length: 24 }, (_, hour) => (
                    <li key={hour} className="hour-block">
                        <HoverButton day={day} hour={hour} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default CalendarDayOfWeek