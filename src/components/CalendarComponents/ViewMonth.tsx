import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, getISOWeek } from 'date-fns';

import './ViewMonth.css';
import CalendarTitle from './CalendarTitle';
import CalendarHeader from './CalendarHeader';

import { useDateView } from '../../contexts/DateViewContext';
import CalendarDayOfMonth from './CalendarDayOfMonth';
import CalendarEvent from '../CalendarEventsComponents/CalendarEvent';

const ViewMonth = () => {
  const { currentDate, setCurrentDate, setViewType, setActiveView } = useDateView();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const handleWeekClick = (day: Date) => {
    setCurrentDate(day)
    setViewType('Week');
    setActiveView(`/viewWeek`);
  };

  const getDaysInMonth = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const daysInMonth = getDaysInMonth();

  // Group days by weeks
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7));
  }

  return (
    <div className="view-month">
      <CalendarTitle />
      <CalendarHeader start={startDate} />
      <div className="view-month-grid">
        {weeks.map((weekDays, weekIndex) => {
          const weekNumber = getISOWeek(weekDays[0]);
          return (
            <div key={weekIndex} className="view-month-week">
              <div
                title="View the week" 
                onClick={() => handleWeekClick(weekDays[0])}
                className="view-month-week-number">{weekNumber}</div>
              {weekDays.map((day, index) => {

                return (
                  <CalendarDayOfMonth key={index} day={day} />
                );
              })}
            </div>
          );
        })}
      </div>
      <CalendarEvent />
    </div>
  );
};

export default ViewMonth;
