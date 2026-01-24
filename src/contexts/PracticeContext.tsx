import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Practice } from '../data/types';
import { mockPractices } from '../data/mockData';

interface PracticeContextType {
  practices: Practice[];
  addPractice: (practice: Practice) => void;
  updatePractice: (id: string, practice: Practice) => void;
  deletePractice: (id: string) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

interface PracticeProviderProps {
  children: ReactNode;
}

export function PracticeProvider({ children }: PracticeProviderProps) {
  const [practices, setPractices] = useState<Practice[]>(mockPractices);

  const addPractice = (practice: Practice) => {
    setPractices((prev) => [...prev, practice]);
  };

  const updatePractice = (id: string, practice: Practice) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? practice : p))
    );
  };

  const deletePractice = (id: string) => {
    setPractices((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PracticeContext.Provider
      value={{ practices, addPractice, updatePractice, deletePractice }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractices() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractices must be used within a PracticeProvider');
  }
  return context;
}
