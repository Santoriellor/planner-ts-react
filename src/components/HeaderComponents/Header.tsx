import Nav from './Nav'
import CurrentDate from './CurrentDate'
import ViewPicker from './ViewPicker'
import User from './User'

const Header = () => {
  return (
    <header>
        <Nav />
        <CurrentDate />
        <div className='picker-and-user'>
            <ViewPicker />
            <User />
        </div>
    </header>
  )
}

export default Header