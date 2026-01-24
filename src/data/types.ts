export interface Song {
  id: string;
  title: string;
  key: string;
  bpm: number;
  tags: string[];
  memo: string;
  referenceUrl?: string;
  createdAt: Date;
}

export interface Practice {
  id: string;
  date: Date;
  location: string;
  meetTime?: string;
  purpose: string;
  songs: PracticeSong[];
  checklist: ChecklistItem[];
  memo: string;
}

export interface PracticeSong {
  songId: string;
  order: number;
  goal: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  date: Date;
  venue: string;
  meetTime?: string;
  setlist: SetlistSong[];
  checklist: ChecklistItem[];
  memo: string;
  status: 'scheduled' | 'completed';
}

export interface SetlistSong {
  songId: string;
  order: number;
  memo?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  type: 'studio' | 'live';
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface PracticeLog {
  id: string;
  date: Date;
  relatedPracticeId?: string;
  relatedLiveId?: string;
  songs: LogSong[];
  goodPoints: string;
  issues: string;
  nextActions: string;
}

export interface LogSong {
  songId: string;
  achievement: number;
}

export type TabType = 'home' | 'songs' | 'schedule' | 'live' | 'log';
