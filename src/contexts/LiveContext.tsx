import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LiveEvent } from '../data/types';
import { mockLiveEvents } from '../data/mockData';

interface LiveContextType {
  liveEvents: LiveEvent[];
  addLiveEvent: (event: LiveEvent) => void;
  updateLiveEvent: (id: string, event: LiveEvent) => void;
  deleteLiveEvent: (id: string) => void;
}

const LiveContext = createContext<LiveContextType | undefined>(undefined);

interface LiveProviderProps {
  children: ReactNode;
}

export function LiveProvider({ children }: LiveProviderProps) {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(mockLiveEvents);

  const addLiveEvent = (event: LiveEvent) => {
    setLiveEvents((prev) => [...prev, event]);
  };

  const updateLiveEvent = (id: string, event: LiveEvent) => {
    setLiveEvents((prev) =>
      prev.map((e) => (e.id === id ? event : e))
    );
  };

  const deleteLiveEvent = (id: string) => {
    setLiveEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <LiveContext.Provider
      value={{ liveEvents, addLiveEvent, updateLiveEvent, deleteLiveEvent }}
    >
      {children}
    </LiveContext.Provider>
  );
}

export function useLiveEvents() {
  const context = useContext(LiveContext);
  if (context === undefined) {
    throw new Error('useLiveEvents must be used within a LiveProvider');
  }
  return context;
}
