import React, { createContext, useState, useContext, ReactNode } from 'react';

type PeopleContextType = {
    peopleConcerned: {
        id: string;
        name: string;
        picture: string;
    }[];
    setPeopleConcerned: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        picture: string;
    }[]>>;
    peopleResponsible: {
        id: string;
        name: string;
        picture: string;
    }[];
    setPeopleResponsible: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        picture: string;
    }[]>>;
};

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const PeopleProvider = ({ children }: { children: ReactNode }) => {
    const [peopleConcerned, setPeopleConcerned] = useState([
        { id: '1', name: 'Rémy', picture: '../src/assets/pics/remy.png' },
        { id: '2', name: 'Maria', picture: '../src/assets/pics/maria.png' },
        { id: '3', name: 'Matai', picture: '../src/assets/pics/matai.png' },
        { id: '4', name: 'Miri', picture: '../src/assets/pics/miri.png' },
        { id: '5', name: 'Naia', picture: '../src/assets/pics/naia.png' },
    ]);

    const [peopleResponsible, setPeopleResponsible] = useState([
        { id: '1', name: 'Rémy', picture: '../src/assets/pics/remy.png' },
        { id: '2', name: 'Maria', picture: '../src/assets/pics/maria.png' },
        { id: '3', name: 'Grosspapi', picture: '../src/assets/pics/grosspapi.png' },
        { id: '4', name: 'Moni', picture: '../src/assets/pics/moni.png' },
        { id: '5', name: 'Grossmami', picture: '../src/assets/pics/grossmami.png' },
    ]);

  return (
    <PeopleContext.Provider value={{ peopleConcerned, setPeopleConcerned, peopleResponsible, setPeopleResponsible }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (context === undefined) {
    throw new Error('useDateView must be used within a DateViewProvider');
  }
  return context;
};
