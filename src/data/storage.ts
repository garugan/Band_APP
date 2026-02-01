import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Song, Practice, LiveEvent, PracticeLog, ChecklistTemplate, Profile } from './types';

const KEYS = {
  SONGS: 'songs',
  PRACTICES: 'practices',
  LIVE_EVENTS: 'liveEvents',
  PRACTICE_LOGS: 'practiceLogs',
  CHECKLIST_TEMPLATES: 'checklistTemplates',
  PROFILE: 'profile',
} as const;

// --- 汎用ヘルパー ---

async function getItem<T>(key: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(key);
  if (json == null) return null;
  return JSON.parse(json) as T;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

// --- 各データ型ごとのアクセサ ---

export const SongStorage = {
  getAll: () => getItem<Song[]>(KEYS.SONGS).then((v) => v ?? []),
  saveAll: (songs: Song[]) => setItem(KEYS.SONGS, songs),
  clear: () => removeItem(KEYS.SONGS),
};

export const PracticeStorage = {
  getAll: () => getItem<Practice[]>(KEYS.PRACTICES).then((v) => v ?? []),
  saveAll: (practices: Practice[]) => setItem(KEYS.PRACTICES, practices),
  clear: () => removeItem(KEYS.PRACTICES),
};

export const LiveEventStorage = {
  getAll: () => getItem<LiveEvent[]>(KEYS.LIVE_EVENTS).then((v) => v ?? []),
  saveAll: (events: LiveEvent[]) => setItem(KEYS.LIVE_EVENTS, events),
  clear: () => removeItem(KEYS.LIVE_EVENTS),
};

export const PracticeLogStorage = {
  getAll: () => getItem<PracticeLog[]>(KEYS.PRACTICE_LOGS).then((v) => v ?? []),
  saveAll: (logs: PracticeLog[]) => setItem(KEYS.PRACTICE_LOGS, logs),
  clear: () => removeItem(KEYS.PRACTICE_LOGS),
};

export const ChecklistTemplateStorage = {
  getAll: () => getItem<ChecklistTemplate[]>(KEYS.CHECKLIST_TEMPLATES).then((v) => v ?? []),
  saveAll: (templates: ChecklistTemplate[]) => setItem(KEYS.CHECKLIST_TEMPLATES, templates),
  clear: () => removeItem(KEYS.CHECKLIST_TEMPLATES),
};

export const ProfileStorage = {
  get: () => getItem<Profile>(KEYS.PROFILE),
  save: (profile: Profile) => setItem(KEYS.PROFILE, profile),
  clear: () => removeItem(KEYS.PROFILE),
};

export { KEYS };
