import { format, addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from 'date-fns';
import './CalendarTitle.css';

import { useDateView } from '../../contexts/DateViewContext';

const CalendarTitle = () => {
    const { currentDate, viewType, setCurrentDate, setViewType, setActiveView } = useDateView();

    // Handlers for changing the week
    const goToPrevious = () => {
        if (viewType=='Week') {
            setCurrentDate(subWeeks(currentDate, 1)); // Move back one week
        } else if (viewType=='Month') {
            setCurrentDate(subMonths(currentDate, 1)); // Move back one month
        } else if (viewType=='Day') {
            setCurrentDate(subDays(currentDate, 1)); // Move back one day
        }
    };

    const goToNext = () => {
        if (viewType=='Week') {
            setCurrentDate(addWeeks(currentDate, 1)); // Move forward one week
        } else if (viewType=='Month') {
            setCurrentDate(addMonths(currentDate, 1)); // Move forward one month
        } else if (viewType=='Day') {
            setCurrentDate(addDays(currentDate, 1)); // Move forward one day
        }
    };

    const handleMonthClick = () => {
        setViewType('Month');
        setActiveView(`/viewMonth`);
    };

    return (
        <div className='calendar-title'>
            <button onClick={goToPrevious}>&lt;&lt; Previous {viewType}</button>
            <h3
                title={viewType !== 'Month' ? "View the month" : ""}
                className={`${viewType !== 'Month' ? 'calendar-title-clickable' : 'calendar-title-notclickable'}`}
                onClick={viewType !== 'Month' ? handleMonthClick : undefined}
            >
                {format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={goToNext}>Next {viewType} &gt;&gt;</button>
        </div>
    )
}
export default CalendarTitle

