import { isSameDay } from "date-fns";
import './CurrentDate.css';

import { useDateView } from '../../contexts/DateViewContext';

const CurrentDate = () => {
  const { currentDate, setCurrentDate, viewType, setActiveView } = useDateView();

  const today = new Date();
  const isToday = isSameDay(currentDate, today);

  const changeActiveView = () => {
    setCurrentDate(today);
    setActiveView(`/view${viewType}`);
  }
    
  return (
    <div onClick={changeActiveView} title="Back to the current day" className="current-date prevent-select">{isToday ? "Today is" : "Back to"} the {today.getDate()}/{today.getMonth()+ 1}/{today.getFullYear()}</div>
  )
}

export default CurrentDate