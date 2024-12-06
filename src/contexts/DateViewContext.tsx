import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type DateViewContextType = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  viewType: string;
  setViewType: React.Dispatch<React.SetStateAction<string>>;
  activeView: string;
  setActiveView: React.Dispatch<React.SetStateAction<string>>
};

const DateViewContext = createContext<DateViewContextType | undefined>(undefined);

export const DateViewProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<string>('week');
  const [activeView, setActiveView] = useState<string>('/');
  const navigate = useNavigate();

  // Effect to navigate whenever activeView changes
  useEffect(() => {
    if (activeView) {
      navigate(activeView); // Navigate to the active view
    }
  }, [activeView, navigate]); // Add navigate to dependencies to prevent lint warnings


  return (
    <DateViewContext.Provider value={{ currentDate, setCurrentDate, viewType, setViewType, activeView, setActiveView }}>
      {children}
    </DateViewContext.Provider>
  );
};

export const useDateView = () => {
  const context = useContext(DateViewContext);
  if (context === undefined) {
    throw new Error('useDateView must be used within a DateViewProvider');
  }
  return context;
};
