// storage.js – wrapper around localStorage for now
export function getQuests() {
  const data = localStorage.getItem('quests');
  return data ? JSON.parse(data) : [];
}
export function setQuests(quests) {
  localStorage.setItem('quests', JSON.stringify(quests));
}
