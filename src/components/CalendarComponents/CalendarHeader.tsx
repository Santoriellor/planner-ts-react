import { format, addDays } from 'date-fns';

import './CalendarHeader.css'

import { useDateView } from '../../contexts/DateViewContext';

type CalendarHeaderProps = {
  start: Date
}

const CalendarHeader = ({ start }: CalendarHeaderProps) => {
  const { viewType, setCurrentDate, setViewType, setActiveView } = useDateView();

  const handleDayClick = (day: Date) => {
    setCurrentDate(day)
    setViewType('Day');
    setActiveView(`/viewDay`);
  };

  return (
    <div className="calendar-header">
      {viewType === 'Day' && (
        <div className="calendar-header-item">
          <span>{format(start, 'EEEE dd')}</span>
        </div>
      )}
      {viewType !== 'Day' && (<div className='calendar-header-empty'></div>)}
      {viewType !== 'Day' && (
        Array.from({ length: 7 }).map((_, index) => {
          const day = addDays(start, index);
          const formattedDay = viewType === 'Week' ? format(day, 'EEE dd') : format(day, 'EEE');
          return (
            <div key={index} className="calendar-header-item">
              {viewType === 'Week' && (
                <button onClick={() => handleDayClick(day)} title="View the day">{formattedDay}</button>
              )}
              {viewType === 'Month' && (
                <span>{formattedDay}</span>
              )}
            </div>
          );
        }))
      }
    </div>
  )};
  
  export default CalendarHeader;
  