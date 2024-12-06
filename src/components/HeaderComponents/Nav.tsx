import './Nav.css';

import { useDateView } from '../../contexts/DateViewContext';

const Nav = () => {
  const { setActiveView } = useDateView();

  return (
    <nav id="nav">
        <ul className='prevent-select'>
            <li onClick={() => setActiveView('/')}>Home</li>
            <li onClick={() => setActiveView('/about')}>About</li>
            <li onClick={() => setActiveView('/contact')}>Contact</li>
        </ul>
    </nav>
  )
}

export default Nav