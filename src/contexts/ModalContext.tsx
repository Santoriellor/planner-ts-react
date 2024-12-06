import { createContext, useContext, ReactNode } from 'react';

import { CalendarEvent } from '../contexts/EventsContext';
import useModal from '../hooks/useModal';

interface ModalContextType {
  isModalOpen: boolean;
  selectedDateTime: Date;
  calendarEventToEdit: CalendarEvent | undefined;
  openModal: (dateTime: Date, calendarEvent?: CalendarEvent) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { isModalOpen, selectedDateTime, calendarEventToEdit, openModal, closeModal } = useModal();

  return (
    <ModalContext.Provider value={{ isModalOpen, selectedDateTime, calendarEventToEdit, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
