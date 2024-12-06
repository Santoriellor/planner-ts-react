import { useState, useEffect } from 'react';
import { addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './CalendarEvent.css';

import { useCalendarEvents, CalendarEvent as CalendarEventObject } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { useModalContext } from '../../contexts/ModalContext';

const CalendarEvent = () => {
    const { addCalendarEvent, editCalendarEvent, deleteCalendarEvent } = useCalendarEvents();  // Get the addEvent function from context
    const { peopleConcerned, peopleResponsible } = usePeople();
    const { isModalOpen, selectedDateTime, calendarEventToEdit, closeModal } = useModalContext();

    const [calendarEventTitle, setEventTitle] = useState('');
    const [calendarEventDescription, setEventDescription] = useState('');
    const [calendarEventLocation, setEventLocation] = useState('');
    const [calendarEventWhoIsConcerned, setEventWhoIsConcerned] = useState<string[]>([]);
    const [calendarEventDoneBy, setEventDoneBy] = useState<string[]>([]);
    const [calendarEventWholeDay, setEventWholeDay] = useState(false);
    const [calendarEventRepeat, setEventRepeat] = useState<"no-repeat" | "weekly" | "two-weeks" | "monthly" | "yearly">('no-repeat');
    const [startingDate, setStartingDate] = useState(selectedDateTime); // New state for starting date
    const [endingDate, setEndingDate] = useState<Date>(addHours(selectedDateTime, 1)); // New state for ending date

    // const [newPersonName, setNewPersonName] = useState('');  // State for new person's name
    // const [newPersonPicture, setNewPersonPicture] = useState('');  // State for new person's picture (optional)

    // If editing, pre-fill the form with the event data
    useEffect(() => {
      if (calendarEventToEdit) {
        setEventTitle(calendarEventToEdit.title);
        setEventDescription(calendarEventToEdit.description || '');
        setEventLocation(calendarEventToEdit.location || '');
        setEventWhoIsConcerned(calendarEventToEdit.whoIsConcerned || []);
        setEventDoneBy(calendarEventToEdit.doneBy || []);
        setEventWholeDay(calendarEventToEdit.wholeDay || false);
        setEventRepeat(calendarEventToEdit.repeat || 'no-repeat');
        setStartingDate(new Date(calendarEventToEdit.startingDate));
        setEndingDate(new Date(calendarEventToEdit.endingDate));
      } else {
        setStartingDate(selectedDateTime); // Reset to selected date if not editing
        setEndingDate(addHours(selectedDateTime, 1)); // Reset ending date to selected date + 1 hour
      }
    }, [calendarEventToEdit, selectedDateTime]);


    // Handle checkbox toggle for selecting people concerned
    const handleCheckboxChangeWhoIsConcerned = (personId: string) => {
      setEventWhoIsConcerned((prevWhoIsConcerned) => {
        if (prevWhoIsConcerned.includes(personId)) {
          // If the person is already selected, remove them
          return prevWhoIsConcerned.filter((id) => id !== personId);
        } else {
          // Otherwise, add the person to the selected list
          return [...prevWhoIsConcerned, personId];
        }
      });
    };

    // Handle checkbox toggle for selecting people ersponsible
    const handleCheckboxChangeDoneBy = (personId: string) => {
      setEventDoneBy((prevDoneBy) => {
        if (prevDoneBy.includes(personId)) {
          // If the person is already selected, remove them
          return prevDoneBy.filter((id) => id !== personId);
        } else {
          // Otherwise, add the person to the selected list
          return [...prevDoneBy, personId];
        }
      });
    };

    // Handle adding a new person
    
    /*const handleAddPerson = () => {
      if (newPersonName) {
        const newPerson = {
          id: Date.now().toString(),  // Unique ID
          name: newPersonName,
          picture: '../src/assets/pics/default.png',  // Placeholder if no picture
        };

        setPeopleResponsible((prevPeopleResponsible) => [...prevPeopleResponsible, newPerson]);  // Add new person to people array
        setEventDoneBy((prev) => [...prev, newPerson.id]);  // Select the newly added person
        setNewPersonName('');  // Clear the input fields
        // setNewPersonPicture('');
      }
    };
    */

    // Handle the 'Enter' key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
        e.preventDefault();  // Prevent form submission
        handleSubmit(e);
        }
    };

    // Reset the form
    const resetForm = () => {
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setEventWhoIsConcerned([]);
        setEventDoneBy([]);
        setEventWholeDay(false);
        setEventRepeat('no-repeat');
        setStartingDate(new Date()); // Reset starting date
        setEndingDate(addHours(startingDate, 1)); // Reset ending date
    }

    // Handle the event submission (saving the event)
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const newCalendarEvent: CalendarEventObject = {
        id: calendarEventToEdit ? calendarEventToEdit.id : Date.now().toString(),
        startingDate: startingDate,
        endingDate: endingDate || startingDate,
        title: calendarEventTitle,
        description: calendarEventDescription,
        location: calendarEventLocation,
        whoIsConcerned: calendarEventWhoIsConcerned,
        doneBy: calendarEventDoneBy,
        wholeDay: calendarEventWholeDay,
        repeat: calendarEventRepeat,
        };

        if (newCalendarEvent.title) {
          if (calendarEventToEdit) {
          editCalendarEvent(calendarEventToEdit.id, newCalendarEvent);  // Modify existing event
          } else {
          addCalendarEvent(newCalendarEvent);  // Add new event
          }
      
          // Reset the form after saving
          resetForm();
          closeModal(); // Close the modal after saving
        }
    };

    const closeEvent = (event: React.FormEvent) => {
        event.preventDefault();
        // Reset the form after closing
        resetForm();
        closeModal(); // Close the modal
    }

    // Handle the delete action
    const handleDeleteEvent = (id: string) => {
        deleteCalendarEvent(id);
        resetForm();
        closeModal();
    };

    const handleDateChange = (date: Date | null, setDate: (date: Date) => void) => {
      if (date) {
        setDate(date); // Call the provided setter function
      } else {
        console.warn("Date is null");
      }
    };

    if (!isModalOpen) return null;
  
    return (
        <div className="modal-backdrop">
          <div className="modal">
            <form id="new-event" onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
              <div className="modal-header">
                <h2>{calendarEventToEdit ? 'Edit Event' : 'Create Event'}</h2>
                <button onClick={closeEvent}>&#x2715;</button>
              </div>
              <div className="modal-body">
                <fieldset className="modal-fieldset" role="presentation">
                <legend>Title and when</legend>
                  <input
                    type="text"
                    placeholder="Title required"
                    value={calendarEventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    style={{
                      borderColor: calendarEventTitle ? 'initial' : 'red',
                    }}
                  />
                  {/* Starting Date */}
                  <label>
                      Start :&nbsp;
                      <DatePicker
                        selected={startingDate}
                        onChange={(date) => handleDateChange(date, setStartingDate)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy HH:mm"
                      />
                      {/* <input
                          type="datetime-local"
                          value={startingDate instanceof Date ? formatISO(startingDate, { representation: 'complete' }).slice(0, 16) : ''} // Format to match datetime-local input
                          onChange={(e) => setStartingDate(new Date(e.target.value))}
                      /> */}
                  </label>
                  {/* Ending Date */}
                  <label>
                      End :&nbsp;
                      <DatePicker
                        selected={endingDate}
                        onChange={(date) => handleDateChange(date, setEndingDate)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy HH:mm"
                      />
                      {/* <input
                          type="datetime-local"
                          value={endingDate instanceof Date ? endingDate.toISOString().slice(0, 16) : ''} // Format to match datetime-local input
                          onChange={(e) => setEndingDate(new Date(e.target.value))}
                      /> */}
                  </label>
                </fieldset>
                <fieldset className="modal-fieldset" role="presentation">
                <legend>What and where</legend>
                  <textarea
                    placeholder="Event Description"
                    value={calendarEventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Event Location"
                    value={calendarEventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                </fieldset>
                <fieldset className="modal-fieldset" role="presentation" style={{ height: '125px' }}>
                <legend>Who is concerned</legend>
                  <div className="modal-people-checkbox-list">
                    {peopleConcerned.map((personConcerned) => (
                      <label key={personConcerned.id}>
                        <input
                          type="checkbox"
                          value={personConcerned.id}
                          checked={calendarEventWhoIsConcerned.includes(personConcerned.id)}
                          onChange={() => handleCheckboxChangeWhoIsConcerned(personConcerned.id)}
                        />
                        {personConcerned.name}
                      </label>
                    ))}
                  </div>
                  <div className="modal-selected-people">
                    {calendarEventWhoIsConcerned.map((personId) => {
                      const personConcerned = peopleConcerned.find((p) => p.id === personId);
                      return personConcerned ? (
                        <div key={personId} className="personConcerned">
                          <img src={personConcerned.picture} alt={personConcerned.name} style={{ width: '30px', borderRadius: '50%' }} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </fieldset>
                <fieldset className="modal-fieldset" role="presentation" style={{ height: '125px' }}>
                <legend>Who does it</legend>
                  <div className="modal-people-checkbox-list">
                    {peopleResponsible.map((personResponsible) => (
                      <label key={personResponsible.id}>
                        <input
                          type="checkbox"
                          value={personResponsible.id}
                          checked={calendarEventDoneBy.includes(personResponsible.id)}
                          onChange={() => handleCheckboxChangeDoneBy(personResponsible.id)}
                        />
                        {personResponsible.name}
                      </label>
                    ))}
                  </div>
{/*
                  Input fields for adding a new person
                  <div className="add-new-person">
                    <input
                      type="text"
                      placeholder="Add a new person"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                    />
                    <button type="button" onClick={handleAddPerson}>
                      Add Person
                    </button>
                  </div>
*/}
                  <div className="modal-selected-people">
                    {calendarEventDoneBy.map((personId) => {
                      const personResponsible = peopleResponsible.find((p) => p.id === personId);
                      return personResponsible ? (
                        <div key={personId} className="person">
                          <img src={personResponsible.picture} alt={personResponsible.name} style={{ width: '30px', borderRadius: '50%' }} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </fieldset>
                <fieldset className="modal-fieldset" role="presentation">
                <legend>How many times</legend>
                  <label><input
                    type="checkbox"
                    checked={calendarEventWholeDay}
                    onChange={(e) => setEventWholeDay(e.target.checked)}
                  />All day event</label>
                  {/* eventRepeat select dropdown */}
                  <select
                    value={calendarEventRepeat}
                    onChange={(e) => setEventRepeat(e.target.value as "no-repeat" | "weekly" | "two-weeks" | "monthly" | "yearly")}
                  >
                    <option value="no-repeat">No Repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="two-weeks">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </fieldset>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className={`modal-edit-button ${!calendarEventTitle ? 'disabled' : ''}`}
                  disabled={!calendarEventTitle}
                >{calendarEventToEdit ? 'Save Changes' : 'Create Event'}</button>
                {calendarEventToEdit && (
                    <button type="button" className='modal-delete-button' onClick={() => handleDeleteEvent(calendarEventToEdit.id)}>
                    Delete Event
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      );
}
export default CalendarEvent