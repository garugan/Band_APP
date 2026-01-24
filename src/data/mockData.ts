import { Song, Practice, LiveEvent, ChecklistTemplate, PracticeLog, ChecklistItem } from './types';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: '夜に駆ける',
    key: 'G#m',
    bpm: 130,
    tags: ['ロック', 'アップテンポ'],
    memo: 'イントロのギターリフに注意。サビは手数多め。',
    referenceUrl: 'https://www.youtube.com/example',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Pretender',
    key: 'F',
    bpm: 92,
    tags: ['バラード', 'ミディアム'],
    memo: 'Aメロは抑えめ、サビでしっかり盛り上げる。転調後の展開を忘れずに。',
    referenceUrl: 'https://www.youtube.com/example2',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'マリーゴールド',
    key: 'C',
    bpm: 102,
    tags: ['ポップ', 'キャッチー'],
    memo: 'シンプルな構成。ドラムのフィルインでアクセントをつける。',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    title: 'Lemon',
    key: 'Am',
    bpm: 87,
    tags: ['バラード', 'エモい'],
    memo: 'サビのクライマックスで感情を込める。テンポキープ重要。',
    referenceUrl: 'https://www.youtube.com/example3',
    createdAt: new Date('2024-02-20'),
  },
];

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

export const mockPractices: Practice[] = [
  {
    id: 'p1',
    date: new Date('2025-01-25T14:00:00'),
    location: 'スタジオノア渋谷',
    meetTime: '13:50',
    purpose: '新曲2曲の通し練習',
    songs: [
      { songId: '1', order: 1, goal: 'BPM130で安定して演奏' },
      { songId: '2', order: 2, goal: '転調後のアレンジ確認' },
    ],
    checklist: JSON.parse(JSON.stringify(studioChecklistItems)),
    memo: '',
  },
  {
    id: 'p2',
    date: new Date('2025-01-28T19:00:00'),
    location: 'スタジオペンタ新宿',
    meetTime: '18:50',
    purpose: 'ライブに向けた最終調整',
    songs: [
      { songId: '1', order: 1, goal: 'イントロのタイミング合わせ' },
      { songId: '3', order: 2, goal: 'サビのユニゾン強化' },
      { songId: '4', order: 3, goal: '通し演奏' },
    ],
    checklist: JSON.parse(JSON.stringify(studioChecklistItems)),
    memo: 'ライブ前最後の練習。全体のバランスを確認する。',
  },
];

export const mockLiveEvents: LiveEvent[] = [
  {
    id: 'l1',
    title: '新宿LOFT ライブイベント',
    date: new Date('2025-02-01T18:00:00'),
    venue: '新宿LOFT',
    meetTime: '16:30',
    setlist: [
      { songId: '3', order: 1, memo: 'チューニング：レギュラー' },
      { songId: '1', order: 2, memo: 'テンポ注意' },
      { songId: '2', order: 3, memo: 'MC後' },
      { songId: '4', order: 4, memo: 'ラスト・感情込めて' },
    ],
    checklist: JSON.parse(JSON.stringify(liveChecklistItems)),
    memo: '持ち時間30分。転換5分。',
    status: 'scheduled',
  },
  {
    id: 'l2',
    title: '下北沢SHELTER',
    date: new Date('2024-12-15T19:00:00'),
    venue: '下北沢SHELTER',
    setlist: [
      { songId: '3', order: 1 },
      { songId: '4', order: 2 },
    ],
    checklist: [],
    memo: '',
    status: 'completed',
  },
];

export const mockPracticeLogs: PracticeLog[] = [
  {
    id: 'log1',
    date: new Date('2025-01-20T14:00:00'),
    relatedPracticeId: undefined,
    songs: [
      { songId: '1', achievement: 75 },
      { songId: '2', achievement: 60 },
    ],
    goodPoints: 'テンポキープが以前より安定してきた。',
    issues: '転調後のギターソロでミスが目立つ。',
    nextActions: '転調後のフレーズを重点的に練習する。',
  },
  {
    id: 'log2',
    date: new Date('2025-01-18T19:00:00'),
    relatedPracticeId: undefined,
    songs: [
      { songId: '3', achievement: 85 },
      { songId: '4', achievement: 70 },
    ],
    goodPoints: 'サビのユニゾンがきれいに決まった。',
    issues: 'イントロの入りが遅れがち。',
    nextActions: 'クリックを使って正確なタイミングを身につける。',
  },
];

export const bandInfo = {
  name: 'My Band',
  memberName: '自分',
};

export const getSongById = (id: string): Song | undefined => {
  return mockSongs.find(song => song.id === id);
};
