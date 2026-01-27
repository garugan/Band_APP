import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Song } from '../data/types';
import { mockSongs } from '../data/mockData';
import { SongStorage } from '../data/storage';

interface SongContextType {
  songs: Song[];
  isLoading: boolean;
  addSong: (song: Song) => void;
  updateSong: (id: string, song: Song) => void;
  deleteSong: (id: string) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

/** AsyncStorage から復元した JSON の date 文字列を Date オブジェクトに変換 */
function hydrateDates(raw: Song[]): Song[] {
  return raw.map((s) => ({
    ...s,
    createdAt: new Date(s.createdAt),
  }));
}

export function SongProvider({ children }: SongProviderProps) {
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [isLoading, setIsLoading] = useState(true);

  // --- 初回ロード ---
  useEffect(() => {
    (async () => {
      try {
        const stored = await SongStorage.getAll();
        if (stored.length > 0) {
          setSongs(hydrateDates(stored));
        }
        // stored が空なら mockSongs をそのまま使い、初回保存
        if (stored.length === 0) {
          await SongStorage.saveAll(mockSongs);
        }
      } catch (e) {
        console.error('Failed to load songs:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- 永続化ヘルパー ---
  const persist = useCallback((next: Song[]) => {
    SongStorage.saveAll(next).catch((e) =>
      console.error('Failed to save songs:', e)
    );
  }, []);

  const addSong = useCallback((song: Song) => {
    setSongs((prev) => {
      const next = [...prev, song];
      persist(next);
      return next;
    });
  }, [persist]);

  const updateSong = useCallback((id: string, song: Song) => {
    setSongs((prev) => {
      const next = prev.map((s) => (s.id === id ? song : s));
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteSong = useCallback((id: string) => {
    setSongs((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <SongContext.Provider
      value={{ songs, isLoading, addSong, updateSong, deleteSong }}
    >
      {children}
    </SongContext.Provider>
  );
}

export function useSongs() {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return context;
}
