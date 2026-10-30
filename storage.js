/* storage.js – wrapper around localStorage
   *  Exposes `loadData` and `saveData` for the app.
   */

  const STORAGE_KEY = 'quest-log-data';

  export function loadData() {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : { quests: [], player: {} };
  }

  export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }