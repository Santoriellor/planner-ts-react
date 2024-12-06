import { useState } from 'react';

import { CalendarEvent } from '../contexts/EventsContext';

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [calendarEventToEdit, setCalendarEventToEdit] = useState<CalendarEvent | undefined>(undefined);


  const openModal = (dateTime: Date, calendarEvent?: CalendarEvent) => {
    setSelectedDateTime(dateTime);
    setIsModalOpen(true);
    setCalendarEventToEdit(calendarEvent);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCalendarEventToEdit(undefined);
  }

  return { isModalOpen, selectedDateTime, calendarEventToEdit, openModal, closeModal };
};

export default useModal;
