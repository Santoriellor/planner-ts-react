import { format, isSameDay, getHours, getMinutes, differenceInMinutes } from 'date-fns';

import './CalendarDay.css';
import HoverButton from './HoverButton';
import { filterEventsForDay } from '../../utils/filterEvents';
import { groupOverlappingEvents } from '../../utils/overlappingEvents';

import { useCalendarEvents } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { useModalContext } from '../../contexts/ModalContext';
import { useDateView } from '../../contexts/DateViewContext';

type CalendarDayOfWeekProps = {
    day: Date,
}

const CalendarDayOfWeek = ({ day }: CalendarDayOfWeekProps) => {
    const { calendarEvents } = useCalendarEvents();
    const { peopleConcerned, peopleResponsible } = usePeople();
    const { openModal } = useModalContext();
    const { viewType } = useDateView();

    const today = new Date();
    const formattedDate = format(day, 'yyyy-MM-dd');
    
    // Filter events for the specific day
    const eventsThisDay = filterEventsForDay(calendarEvents, day);

    const isToday = isSameDay(day, today);

    // Calculate event duration
    const calculateEventDuration = (start: Date, end: Date) => {
        return differenceInMinutes(end, start); // Duration in minutes
    };

    const groupedEvents = groupOverlappingEvents(eventsThisDay);

    return (
        <div key={formattedDate} className={`calendar-day ${isToday ? 'current-day' : ''}`}>
            <div>
                {groupedEvents.map((eventGroup) => {
                    return eventGroup.map((calendarEvent, index) => {
                        // Calculate the position and width for the event
                        const eventDurationMinutes = calculateEventDuration(calendarEvent.startingDate, calendarEvent.endingDate);
                        const eventStartMinutes = getHours(calendarEvent.startingDate) * 60 + getMinutes(calendarEvent.startingDate);
                        const eventWidth = 100 / eventGroup.length; // Divide width by number of overlapping groups
                        const overlapOffset = index * eventWidth; // Adjust the left offset based on group index

                        return (
                            <div
                                key={index}
                                className='calendar-event'
                                style={{
                                    position: 'absolute',
                                    top: `${(eventStartMinutes / 1440) * 100}%`, // Adjust based on hour and minutes
                                    left: `${overlapOffset}%`,
                                    minHeight: `${(eventDurationMinutes / 1440) * 100}%`, // Adjust height based on duration
                                    width: `${eventWidth}%`, // Adjust width to avoid overlap
                                    transition: 'all 0.3s ease', // Smooth transition for sliding effect
                                }}
                            >
                                <button 
                                    onClick={() => openModal(calendarEvent.startingDate, calendarEvent)}
                                    className={`calendar-event-button${viewType == 'Week' ? ' week-view' : ''}`}
                                    onMouseEnter={(e) => {
                                        const button = e.currentTarget;
                                        
                                        // Get the second parent (or the specific containing div)
                                        const parentDiv = button.closest('.view-week-days') || button.parentElement?.parentElement;
                                
                                        if (parentDiv) {
                                            const buttonRect = button.getBoundingClientRect();
                                            const parentRect = parentDiv.getBoundingClientRect();
                                
                                            const overflowRight = buttonRect.right > parentRect.right;
                                            const overflowLeft = buttonRect.left < parentRect.left;
                                
                                            if (overflowRight) {
                                                const offset = buttonRect.right - parentRect.right;
                                                button.style.transform = `translateX(-${offset}px)`;
                                            } else if (overflowLeft) {
                                                const offset = parentRect.left - buttonRect.left;
                                                button.style.transform = `translateX(${offset}px)`;
                                            }
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        // Reset the position when the mouse leaves
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div className="group-img">
                                        {calendarEvent.whoIsConcerned?.map((personId) => {
                                            const person = peopleConcerned.find((p) => p.id === personId);
                                            return person ? (
                                                <img
                                                    key={person.id}
                                                    src={person.picture}
                                                    alt={person.name}
                                                    title={person.name}
                                                    className="person-img"
                                                    style={{ width: '20px', borderRadius: '50%' }}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                    {calendarEvent.title}
                                    <div className="group-img">
                                        {calendarEvent.doneBy?.map((personId) => {
                                            const person = peopleResponsible.find((p) => p.id === personId);
                                            return person ? (
                                                <img
                                                    key={person.id}
                                                    src={person.picture}
                                                    alt={person.name}
                                                    className="person-img"
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
            <ul className="calendar-day-hours">
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