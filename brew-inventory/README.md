# 7 Brew Weekly Count

A React + Vite app for tracking weekly store inventory. Same tool as the Claude
artifact version, but now a standalone project you can run locally, edit in
Claude Code or any editor, and deploy anywhere static sites are hosted
(Netlify, Vercel, GitHub Pages, etc).

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
```

Output goes to `dist/` — drag that folder into Netlify Drop, or point any
static host at it.

## Data storage

This version uses the browser's `localStorage`, so counts persist per-browser
on whatever device you're using it from. There's no shared/cloud sync between
devices — if you want that (e.g. a phone counting cans while a laptop counts
syrups, updating the same list), the next step would be wiring this up to a
small backend (Supabase is a easy fit if you want to reuse what you've already
got set up for Bellwether).

## Project structure

```
src/
  App.jsx       — all app logic + UI (item list, categories, counters, undo/redo, history)
  main.jsx      — React entry point
  index.css     — Tailwind imports
index.html      — HTML shell
tailwind.config.js
vite.config.js
```

## Editing the item list

The starting inventory (items, categories, unit types like Boxes/Sleeves or
Cases/Cans) lives in the `DEFAULT_ITEMS` array near the top of `src/App.jsx`.
Add, remove, or re-categorize items there — it also doubles as what "Reset"
reverts to.
