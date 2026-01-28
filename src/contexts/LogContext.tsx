import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PracticeLog } from '../data/types';
import { mockPracticeLogs } from '../data/mockData';
import { PracticeLogStorage } from '../data/storage';

interface LogContextType {
  logs: PracticeLog[];
  isLoading: boolean;
  addLog: (log: PracticeLog) => void;
  updateLog: (id: string, log: PracticeLog) => void;
  deleteLog: (id: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

interface LogProviderProps {
  children: ReactNode;
}

/** AsyncStorage から復元した JSON の date 文字列を Date オブジェクトに変換 */
function hydrateDates(raw: PracticeLog[]): PracticeLog[] {
  return raw.map((l) => ({
    ...l,
    date: new Date(l.date),
  }));
}

export function LogProvider({ children }: LogProviderProps) {
  const [logs, setLogs] = useState<PracticeLog[]>(mockPracticeLogs);
  const [isLoading, setIsLoading] = useState(true);

  // --- 初回ロード ---
  useEffect(() => {
    (async () => {
      try {
        const stored = await PracticeLogStorage.getAll();
        if (stored.length > 0) {
          setLogs(hydrateDates(stored));
        }
        if (stored.length === 0) {
          await PracticeLogStorage.saveAll(mockPracticeLogs);
        }
      } catch (e) {
        console.error('Failed to load logs:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- 永続化ヘルパー ---
  const persist = useCallback((next: PracticeLog[]) => {
    PracticeLogStorage.saveAll(next).catch((e) =>
      console.error('Failed to save logs:', e)
    );
  }, []);

  const addLog = useCallback((log: PracticeLog) => {
    setLogs((prev) => {
      const next = [...prev, log];
      persist(next);
      return next;
    });
  }, [persist]);

  const updateLog = useCallback((id: string, log: PracticeLog) => {
    setLogs((prev) => {
      const next = prev.map((l) => (l.id === id ? log : l));
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => {
      const next = prev.filter((l) => l.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <LogContext.Provider
      value={{ logs, isLoading, addLog, updateLog, deleteLog }}
    >
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
