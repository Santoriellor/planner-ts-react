import { useEffect, useRef } from 'react';

import './ViewDay.css';
import CalendarTitle from './CalendarTitle';
import CalendarHeader from '../CalendarComponents/CalendarHeader';
import CalendarDay from './CalendarDay';

import { useDateView } from '../../contexts/DateViewContext';

const ViewDay = () => {
  const { currentDate, viewType } = useDateView();

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
    <section className="view-day">
      <CalendarTitle />
      <CalendarHeader start={currentDate} />
      <div className="view-day-scroll-container">
        {/* The scrollable area */}
        <div className="view-day-scrollable" ref={scrollRef} onScroll={(e) => e.preventDefault()}>
          <div className="view-day-grid">
            <div className="view-day-hours">
              {hours.map((hour, index) => (
                <div key={index} className="view-day-hours-label">
                  {hour.toString() !== '' && `${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Each day in the week */}
            <div className="view-day-days">
                  <CalendarDay day={currentDate} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewDay