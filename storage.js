/* storage.js – wrapper around localStorage.
 * Exposes `loadData` and `saveData` for the app.
 */

const STORAGE_KEY = 'quest-log-data';

export function loadData() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : { quests: [], player: {} };
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* Journal entries live under their own key, separate from the quest data. */
const JOURNAL_KEY = 'questlog_journal';

export function loadJournalEntries() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(text) {
  const entries = loadJournalEntries();
  const entry = {
    id: 'j_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    savedAt: Date.now(),
    text,
  };
  entries.push(entry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  return entry;
}

/* Completed quests live under their own key, separate from the quest data. */
const COMPLETED_KEY = 'questlog_completed';

export function loadCompletedQuests() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCompletedQuest(quest) {
  const list = loadCompletedQuests();
  const entry = {
    id: quest.id,
    title: quest.title,
    kind: quest.kind,
    category: quest.category,
    importance: quest.importance,
    tasks: quest.tasks || [],
    completedAt: Date.now(),
  };
  list.push(entry);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(list));
  return entry;
}

export function removeCompletedQuest(id) {
  const list = loadCompletedQuests().filter(c => c.id !== id);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(list));
  return list;
}