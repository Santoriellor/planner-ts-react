import { startOfWeek, addDays } from 'date-fns';
import { useEffect, useRef } from 'react';

import './ViewWeek.css';
import CalendarTitle from './CalendarTitle';
import CalendarHeader from './CalendarHeader';
import CalendarDay from './CalendarDay';

import { useDateView } from '../../contexts/DateViewContext';

const ViewWeek = () => {
  const { currentDate, viewType } = useDateView();

  // const weekNumber = getISOWeek(currentDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create refs for scrolling to 08:00
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Scroll to 08:00 on component mount
  useEffect(() => {
    if (scrollRef.current) {
      const eightAmPosition = scrollRef.current.scrollHeight * (8 / 24); // Scroll to about 8/24th of the day
      scrollRef.current.scrollTo({ top: eightAmPosition, behavior: 'smooth' });
    }
  }, [viewType]);

  return (
    <section className="view-week">
      <CalendarTitle />
      <CalendarHeader start={weekStart} />

      <div className="view-week-scroll-container">
        {/* The scrollable area */}
        <div className="view-week-scrollable" ref={scrollRef} onScroll={(e) => e.preventDefault()}>
          <div className="view-week-grid">
            <div className="view-week-hours">
              {hours.map((hour, index) => (
                <div key={index} className="view-week-hours-label">
                  {hour.toString() !== '' && `${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Each day in the week */}
            <div className="view-week-days">
              {Array.from({ length: 7 }).map((_, index) => {
                const day = addDays(weekStart, index);
                return (
                  <CalendarDay key={index} day={day} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewWeek