import Header from './components/HeaderComponents/Header'
import Home from './components/Home';
import ViewDay from './components/CalendarComponents/ViewDay';
import ViewWeek from './components/CalendarComponents/ViewWeek';
import ViewMonth from './components/CalendarComponents/ViewMonth';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import CalendarEvent from './components/CalendarEventsComponents/CalendarEvent';
import Footer from './components/FooterComponents/Footer'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import { DateViewProvider } from './contexts/DateViewContext';
import { CalendarEventsProvider } from './contexts/EventsContext';
import { ModalProvider } from './contexts/ModalContext';
import { PeopleProvider } from './contexts/PeopleContext';


function App() {

  useEffect(() => {
    document.title = 'My family calendar';
  }, []);

  return (
    <Router>
      <DateViewProvider>
        <CalendarEventsProvider>
        <PeopleProvider>
          <ModalProvider>
            <Header />
            <main>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/viewDay' element={<ViewDay />} />
                <Route path='/viewWeek' element={<ViewWeek />} />
                <Route path='/viewMonth' element={<ViewMonth />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </main>
            {/* Modal Window */}
            <CalendarEvent />
            <Footer />
          </ModalProvider>
          </PeopleProvider>
        </CalendarEventsProvider>
      </DateViewProvider>
    </Router>
  )
}

export default App
