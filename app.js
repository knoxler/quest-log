/* app.js – quest list UI
 *
 *  A simple web app that lets you add quests, view them, and use an AI helper to
 *  suggest importance and type.  Data is persisted in localStorage via
 *  storage.js.
 *
 *  The UI contains:
 *    • Quest creation form (title, type, category, importance, tasks)
 *    • List of quests
 *    • Settings section to choose AI provider and trigger a sort
 */

import { loadData, saveData } from './storage.js';
import { generateResponse } from './ai-helper.js';

const genId = () => '_' + Math.random().toString(36).substr(2, 9);

/* ------------------------------------------------------------------
 * Helper to create DOM elements with attributes and children
 * ------------------------------------------------------------------ */
function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'textContent') {
      el.textContent = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (Array.isArray(child)) {
      child.forEach(n => el.appendChild(n));
    } else if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

function render() {
  const data = loadData();
  if (!data.player) data.player = {};
  if (!data.player.aiProvider) data.player.aiProvider = 'ollama';
  if (!data.quests) data.quests = [];

  const appDiv = document.getElementById('app');
  appDiv.innerHTML = '';
const formContainer = createElement('div', { id: 'form-container' });
appDiv.appendChild(formContainer);
const listContainer = createElement('div', { id: 'list-container' });
appDiv.appendChild(listContainer);

  // Header
  appDiv.appendChild(createElement('h2', {}, 'Quests'));

  // Quest creation form
  const form = createElement('form', { id: 'quest-form' },
    createElement('input', {
      type: 'text',
      id: 'title',
      placeholder: 'Quest title',
      required: true
    }),
    createElement('select', { id: 'kind' },
      createElement('option', { value: 'main' }, 'Main'),
      createElement('option', { value: 'side' }, 'Side')
    ),
    createElement('select', { id: 'category' },
      createElement('option', { value: 'School' }, 'School'),
      createElement('option', { value: 'Job' }, 'Job')
    ),
    createElement('select', { id: 'importance' },
      createElement('option', { value: 'low' }, 'Low'),
      createElement('option', { value: 'medium' }, 'Medium'),
      createElement('option', { value: 'high' }, 'High')
    ),
    createElement('textarea', {
      id: 'tasks',
      placeholder: 'Tasks (one per line)',
      rows: 3
    }),
    createElement('button', { type: 'submit' }, 'Add Quest')
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const kind = document.getElementById('kind').value;
    const category = document.getElementById('category').value;
    const importance = document.getElementById('importance').value;
    const tasksText = document.getElementById('tasks').value.trim();
    const tasks = tasksText ? tasksText.split('\n').map(t => t.trim()).filter(t => t) : [];
    if (!title) return;
    const newQuest = {
      id: genId(),
      title,
      kind,
      category,
      importance,
      tasks,
      status: 'todo',
      createdAt: Date.now()
    };
    data.quests.push(newQuest);
    saveData(data);
    form.reset();
    render();
  });
  formContainer.appendChild(form);

  // Quest list
  const list = createElement('ul', { id: 'quest-list' });
  data.quests.forEach(q => {
    const li = createElement('li',
      createElement('strong', {}, q.title),
      ' ',
      createElement('span', {}, `[${q.kind}]`),
      ' ',
      createElement('span', {}, `(${q.importance})`),
      createElement('ul', {},
        q.tasks.map(t => createElement('li', {}, t))
      )
    );
    list.appendChild(li);
  });
  listContainer.appendChild(list);

  // Settings: AI provider selector and sort button
  const providerSelect = createElement('select', { id: 'provider-select' },
    createElement('option', { value: 'anthropic' }, 'Anthropic'),
    createElement('option', { value: 'ollama' }, 'Ollama')
  );
  providerSelect.value = data.player.aiProvider;
  providerSelect.addEventListener('change', (e) => {
    data.player.aiProvider = e.target.value;
    saveData(data);
    render();
  });

  const sortButton = createElement('button', { id: 'sort-quests' }, 'Sort Quests');
  sortButton.addEventListener('click', async () => {
    if (!data.quests.length) {
      alert('No quests to sort.');
      return;
    }
    const provider = data.player.aiProvider;
    const messages = [
      { role: 'system', content: 'You are a helpful quest organizer. For each quest, suggest an importance (low, medium, high) and type (main or side). Return a JSON object mapping quest ids to {type, importance}.' },
      { role: 'user', content: data.quests.map(q => `${q.id}: ${q.title}`).join('\n') }
    ];
    try {
      const raw = await generateResponse(messages, provider);
      // The model may sometimes return plain text. Try to parse JSON,
      // but if that fails we show the raw response to help debugging.
      let suggestions;
      try {
        suggestions = JSON.parse(raw);
      } catch (parseErr) {
        alert('AI returned non‑JSON. Raw response:\n' + raw);
        return;
      }
      data.quests.forEach(q => {
        const s = suggestions[q.id];
        if (s) {
          if (s.type && ['main', 'side'].includes(s.type)) q.kind = s.type;
          if (s.importance && ['low', 'medium', 'high'].includes(s.importance)) q.importance = s.importance;
        }
      });
      saveData(data);
      render();
      alert('Quests updated with AI suggestions.');
    } catch (err) {
      console.error(err);
      alert('Error fetching AI suggestions: ' + err.message);
    }
  });

  const settingsDiv = createElement('div', { id: 'settings' },
    createElement('label', { for: 'provider-select' }, 'AI Provider: '),
    providerSelect,
    sortButton
  );
  appDiv.appendChild(settingsDiv);
}

// Initial render when the page loads
render();
