import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Practice } from '../data/types';
import { mockPractices } from '../data/mockData';
import { PracticeStorage } from '../data/storage';

interface PracticeContextType {
  practices: Practice[];
  isLoading: boolean;
  addPractice: (practice: Practice) => void;
  updatePractice: (id: string, practice: Practice) => void;
  deletePractice: (id: string) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

interface PracticeProviderProps {
  children: ReactNode;
}

/** AsyncStorage から復元した JSON の date 文字列を Date オブジェクトに変換 */
function hydrateDates(raw: Practice[]): Practice[] {
  return raw.map((p) => ({
    ...p,
    date: new Date(p.date),
  }));
}

export function PracticeProvider({ children }: PracticeProviderProps) {
  const [practices, setPractices] = useState<Practice[]>(mockPractices);
  const [isLoading, setIsLoading] = useState(true);

  // --- 初回ロード ---
  useEffect(() => {
    (async () => {
      try {
        const stored = await PracticeStorage.getAll();
        if (stored.length > 0) {
          setPractices(hydrateDates(stored));
        }
        // stored が空なら mockPractices をそのまま使い、初回保存
        if (stored.length === 0) {
          await PracticeStorage.saveAll(mockPractices);
        }
      } catch (e) {
        console.error('Failed to load practices:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- 永続化ヘルパー ---
  const persist = useCallback((next: Practice[]) => {
    PracticeStorage.saveAll(next).catch((e) =>
      console.error('Failed to save practices:', e)
    );
  }, []);

  const addPractice = useCallback((practice: Practice) => {
    setPractices((prev) => {
      const next = [...prev, practice];
      persist(next);
      return next;
    });
  }, [persist]);

  const updatePractice = useCallback((id: string, practice: Practice) => {
    setPractices((prev) => {
      const next = prev.map((p) => (p.id === id ? practice : p));
      persist(next);
      return next;
    });
  }, [persist]);

  const deletePractice = useCallback((id: string) => {
    setPractices((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <PracticeContext.Provider
      value={{ practices, isLoading, addPractice, updatePractice, deletePractice }}
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
