# Quest Log

A quest log that helps you get organized and gamify your life. You turn your to-dos into quests with importance levels, XP, and levels, so doing the work feels like progress.

It's a quest log first and a game second. The point is to be useful.

## Status

Work in progress. The core quest log works, and the add‑quest form is being fixed and separated from the quest list.

## What it does

Track quests as main or side quests with an importance level. Earn XP, level up, and build streaks. Export and import your quests as JSON. It works on your phone, has a dark theme, and can be installed as a PWA.

There's also an optional AI helper for brainstorming and breaking tasks into steps. It currently uses the Anthropic API.

## How to run

Open index.html in your browser. No build step needed.

To use the AI helper, enter your Anthropic API key in Settings. It's stored only in your browser's localStorage. This is a personal project, so never share your API key.

## Roadmap

First, make the core solid: adding quests, tracking them, and a clean quest log that's easy to use.

Second, make the gamification work well, so importance levels, XP, levels, and streaks actually motivate you to finish things.

Later, add rewards. The idea is a medieval pixel village or character, in the style of Kingdom Come, that looks better as you level up. This is a nice extra, not a priority.

Also planned: a local AI helper using Ollama to sort your quests, and better phone support.
