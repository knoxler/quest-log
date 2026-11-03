# Quest Log

A quest log that helps you get organized and gamify your life. You turn your to-dos into quests with importance levels, XP, and levels, so doing the work feels like progress.

It's a quest log first and a game second. The point is to be useful.

## Status

Core quest log works: adding quests, viewing them, and sorting them with an AI helper. Recent work fixed the AI integration and the UI rendering; the next update is a two-column layout (see Roadmap).

## What it does

Track quests as main or side quests with an importance level, plus a task list per quest. The layout is a quest list on the left with the creation form in a fixed bar at the bottom of the page.

There's an AI helper for sorting: it suggests an importance (low/medium/high) and type (main/side) for each quest. It works with two providers, switchable in the settings bar:

- **Ollama** — local models at `http://localhost:11434` (default `gpt-oss:20b`)
- **Anthropic** — the Messages API, using a key stored in your browser's localStorage under `anthropicApiKey`

## How to run

Because `index.html` uses ES-module imports, it must be served via HTTP (e.g., with VS Code's Live Server, `python -m http.server`, or any local web server). Opening the file directly with `file://` will block the modules and the UI will not load. This is a browser security restriction, not a bug in the code.

To use the AI helper with Anthropic, set your API key in the browser console: `localStorage.setItem('anthropicApiKey', 'sk-...')`. It's stored only in your browser's localStorage. This is a personal project, so never share your API key. Calling the API from the browser is a convenience, not a secure setup — a small local proxy is the proper option if this ever gets shared.

## Recent changes

**2026-11-02** (commit `a16677c`)

- Fixed the Anthropic integration: correct `/v1/messages` endpoint, system prompt as a top-level field, browser-access header, correct response parsing, current model (`claude-sonnet-5-5`)
- Fixed the bottom bar duplicating itself on every re-render (adding a quest or sorting would stack extra copies of the form and settings)
- Removed leftover pixel-art CSS and the stale "Pixel Art" page title
- Added bottom padding so the fixed settings bar doesn't cover content
- Cleaned up comments/indentation; replaced deprecated `substr`

**Earlier**

- Removed the pixel art feature (canvas, upload input, related code)
- Split the quest form out from the quest list; form now lives in the fixed bottom bar on purpose — don't "fix" it back to the top
- Added the running-app note above

## Roadmap

**Next up — two-column system:**

- Left column: the existing quest log
- Right column: a "how to complete" panel — for a selected quest, generated guidance on how to complete it
- The panel content is produced by a local model (Ollama) with a prompt along the lines of *"How can this person complete this task?"*, fed with the quest's title, type, category, importance, and tasks
- Wiring already exists for this: `#right-column` is an empty div waiting for content, and the Ollama branch of `ai-helper.js` is working

**After that:**

Make the gamification work well — importance levels, XP, levels, and streaks that actually motivate you to finish things. Then rewards: a medieval pixel village or character, in the style of Kingdom Come, that looks better as you level up. That's a nice extra, not a priority.
