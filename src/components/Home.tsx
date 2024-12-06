
import './Home.css';
import TodaysEvents from "./TodaysEvents";
import TomorrowsEvents from "./TomorrowsEvents";
import UpcomingWeeksEvents from "./UpcomingWeeksEvents";


const Home = () => {
  return (
    <div className="home-grid">
      <fieldset className="upcoming-events" role="presentation">
        <legend>Coming up soon</legend>
        <TodaysEvents />
        <TomorrowsEvents />
      </fieldset>
      <fieldset className="upcoming-week" role="presentation">
        <legend>Coming up next week</legend>
        <UpcomingWeeksEvents />
      </fieldset>
    </div>
  )
}

export default Home