import { format, isSameDay, isSameMonth } from 'date-fns';

import './CalendarDayOfMonth.css';
import HoverButton from './HoverButton';
import { filterEventsForDay } from '../../utils/filterEvents';

import { useCalendarEvents } from '../../contexts/EventsContext';
import { useDateView } from '../../contexts/DateViewContext';
import { useModalContext } from '../../contexts/ModalContext';

type CalendarDayOfWeekProps = {
  day: Date,
}

const CalendarDayOfMonth = ({ day }: CalendarDayOfWeekProps) => {
  const { calendarEvents } = useCalendarEvents();
  const { currentDate, setCurrentDate, setViewType, setActiveView } = useDateView(); 
  const { openModal } = useModalContext();

  const today = new Date();
  const formattedDate = format(day, 'yyyy-MM-dd');

  const isToday = isSameDay(day, today);
  const isCurrentMonth = isSameMonth(day, currentDate);

  // Filter events for the specific day
  const eventsThisDay = filterEventsForDay(calendarEvents, day);
  
  const handleDayClick = (day: Date) => {
    setCurrentDate(day)
    setViewType('Day');
    setActiveView(`/viewDay`);
  };

  return (
    <div key={formattedDate} className={`calendar-month-day ${isToday ? ' current-month-day' : ''}${!isCurrentMonth ? ' filler-month-day' : ''}`}>
      <button
          key={day.toISOString()}
          title="View the day"
          className="calendar-month-day-button"
          onClick={() => handleDayClick(day)}
        >{format(day, 'd')}</button>
      <ul>
        {eventsThisDay.map((calendarEvent, index) => (
            <li key={index}>
              <button
                onClick={() => openModal(calendarEvent.startingDate, calendarEvent)}
                className='calendar-month-event-button'
              >
                {calendarEvent.title}
              </button>
            </li>
        ))}
        <li className='calendar-month-li-hover-button'><HoverButton  day={day} /></li>
      </ul>
    </div>
  )
}
export default CalendarDayOfMonth