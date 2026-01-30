import { Song, Practice, LiveEvent, ChecklistTemplate, PracticeLog, ChecklistItem } from './types';

export const mockSongs: Song[] = [];

const studioChecklistItems: ChecklistItem[] = [
  { id: 'sc1', text: 'シールド', checked: false },
  { id: 'sc2', text: '電池（9V）', checked: false },
  { id: 'sc3', text: 'ピック', checked: false },
  { id: 'sc4', text: 'チューナー', checked: false },
  { id: 'sc5', text: '譜面', checked: false },
  { id: 'sc6', text: 'クリック端末', checked: false },
  { id: 'sc7', text: 'ドリンク', checked: false },
];

const liveChecklistItems: ChecklistItem[] = [
  { id: 'lc1', text: 'シールド（予備含む）', checked: false },
  { id: 'lc2', text: '電池（9V）×3', checked: false },
  { id: 'lc3', text: 'ピック（予備含む）', checked: false },
  { id: 'lc4', text: 'チューナー', checked: false },
  { id: 'lc5', text: 'セトリ（印刷）', checked: false },
  { id: 'lc6', text: 'ガムテープ', checked: false },
  { id: 'lc7', text: '着替え', checked: false },
  { id: 'lc8', text: 'タオル', checked: false },
];

export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: 'template-studio',
    name: 'スタジオ練習用',
    type: 'studio',
    items: studioChecklistItems,
  },
  {
    id: 'template-live',
    name: 'ライブ本番用',
    type: 'live',
    items: liveChecklistItems,
  },
];

export const mockPractices: Practice[] = [];

export const mockLiveEvents: LiveEvent[] = [];

export const mockPracticeLogs: PracticeLog[] = [];

export const bandInfo = {
  name: 'My Band',
  memberName: '自分',
};

export const getSongById = (id: string): Song | undefined => {
  return mockSongs.find(song => song.id === id);
};
