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