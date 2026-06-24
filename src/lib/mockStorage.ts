const PREFIX = 'devenglish_';

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// --- Locale ---
export function getStoredLocale(): string {
  return localStorage.getItem(PREFIX + 'locale') || 'zh-CN';
}
export function setStoredLocale(locale: string): void {
  localStorage.setItem(PREFIX + 'locale', locale);
}

// --- Saved Vocabulary ---
export interface SavedVocabEntry {
  term: string;
  savedAt: string;
}
export function getSavedVocabulary(): SavedVocabEntry[] {
  return get<SavedVocabEntry[]>('vocab', []);
}
export function saveVocabulary(entry: SavedVocabEntry): void {
  const list = getSavedVocabulary();
  if (!list.find((v) => v.term === entry.term)) {
    list.push(entry);
    set('vocab', list);
  }
}
export function removeVocabulary(term: string): void {
  const list = getSavedVocabulary().filter((v) => v.term !== term);
  set('vocab', list);
}
export function isVocabSaved(term: string): boolean {
  return getSavedVocabulary().some((v) => v.term === term);
}

// --- Saved Sentences ---
export interface SavedSentenceEntry {
  pattern: string;
  savedAt: string;
}
export function getSavedSentences(): SavedSentenceEntry[] {
  return get<SavedSentenceEntry[]>('sentences', []);
}
export function saveSentence(entry: SavedSentenceEntry): void {
  const list = getSavedSentences();
  if (!list.find((s) => s.pattern === entry.pattern)) {
    list.push(entry);
    set('sentences', list);
  }
}
export function removeSentence(pattern: string): void {
  const list = getSavedSentences().filter((s) => s.pattern !== pattern);
  set('sentences', list);
}
export function isSentenceSaved(pattern: string): boolean {
  return getSavedSentences().some((s) => s.pattern === pattern);
}

// --- Completed Lessons ---
export function getCompletedLessons(): string[] {
  return get<string[]>('completed', []);
}
export function markLessonCompleted(slug: string): void {
  const list = getCompletedLessons();
  if (!list.includes(slug)) {
    list.push(slug);
    set('completed', list);
  }
}
export function isLessonCompleted(slug: string): boolean {
  return getCompletedLessons().includes(slug);
}

// --- Review Queue ---
export interface ReviewQueueItem {
  id: string;
  type: 'wrong_answer' | 'vocabulary' | 'sentence' | 'interview_report';
  title: string;
  source: string;
  topicSlug?: string;
  status: 'pending' | 'reviewed' | 'mastered';
  createdAt: string;
}
export function getReviewQueue(): ReviewQueueItem[] {
  return get<ReviewQueueItem[]>('review_queue', []);
}
export function addToReviewQueue(item: ReviewQueueItem): void {
  const queue = getReviewQueue();
  queue.unshift(item);
  set('review_queue', queue);
}
export function updateReviewItemStatus(id: string, status: 'reviewed' | 'mastered'): void {
  const queue = getReviewQueue().map((item) =>
    item.id === id ? { ...item, status } : item
  );
  set('review_queue', queue);
}

// --- Interview Config ---
export interface StoredInterviewConfig {
  mode: string;
  role: string;
  difficulty: string;
  language: string;
  questionCount: number;
  interviewType: string;
  duration: string;
}
export function getInterviewConfig(): StoredInterviewConfig | null {
  return get<StoredInterviewConfig | null>('interview_config', null);
}
export function setInterviewConfig(config: StoredInterviewConfig): void {
  set('interview_config', config);
}

// --- Mock Interview Progress ---
export interface InterviewProgress {
  currentIndex: number;
  answers: Record<number, { text: string; duration: number }>;
  completed: boolean;
}
export function getInterviewProgress(): InterviewProgress | null {
  return get<InterviewProgress | null>('interview_progress', null);
}
export function setInterviewProgress(progress: InterviewProgress): void {
  set('interview_progress', progress);
}
export function clearInterviewProgress(): void {
  localStorage.removeItem(PREFIX + 'interview_progress');
}

// --- Completed Interview Reports ---
export interface StoredReport {
  id: string;
  date: string;
  overallScore: number;
}
export function getCompletedReports(): StoredReport[] {
  return get<StoredReport[]>('reports', []);
}
export function addReport(report: StoredReport): void {
  const reports = getCompletedReports();
  reports.unshift(report);
  set('reports', reports);
}
