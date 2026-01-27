import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LiveEvent } from '../data/types';
import { mockLiveEvents } from '../data/mockData';
import { LiveEventStorage } from '../data/storage';

interface LiveContextType {
  liveEvents: LiveEvent[];
  isLoading: boolean;
  addLiveEvent: (event: LiveEvent) => void;
  updateLiveEvent: (id: string, event: LiveEvent) => void;
  deleteLiveEvent: (id: string) => void;
}

const LiveContext = createContext<LiveContextType | undefined>(undefined);

interface LiveProviderProps {
  children: ReactNode;
}

/** AsyncStorage から復元した JSON の date 文字列を Date オブジェクトに変換 */
function hydrateDates(raw: LiveEvent[]): LiveEvent[] {
  return raw.map((e) => ({
    ...e,
    date: new Date(e.date),
  }));
}

export function LiveProvider({ children }: LiveProviderProps) {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(mockLiveEvents);
  const [isLoading, setIsLoading] = useState(true);

  // --- 初回ロード ---
  useEffect(() => {
    (async () => {
      try {
        const stored = await LiveEventStorage.getAll();
        if (stored.length > 0) {
          setLiveEvents(hydrateDates(stored));
        }
        // stored が空なら mockLiveEvents をそのまま使い、初回保存
        if (stored.length === 0) {
          await LiveEventStorage.saveAll(mockLiveEvents);
        }
      } catch (e) {
        console.error('Failed to load live events:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- 永続化ヘルパー ---
  const persist = useCallback((next: LiveEvent[]) => {
    LiveEventStorage.saveAll(next).catch((e) =>
      console.error('Failed to save live events:', e)
    );
  }, []);

  const addLiveEvent = useCallback((event: LiveEvent) => {
    setLiveEvents((prev) => {
      const next = [...prev, event];
      persist(next);
      return next;
    });
  }, [persist]);

  const updateLiveEvent = useCallback((id: string, event: LiveEvent) => {
    setLiveEvents((prev) => {
      const next = prev.map((e) => (e.id === id ? event : e));
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteLiveEvent = useCallback((id: string) => {
    setLiveEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <LiveContext.Provider
      value={{ liveEvents, isLoading, addLiveEvent, updateLiveEvent, deleteLiveEvent }}
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
