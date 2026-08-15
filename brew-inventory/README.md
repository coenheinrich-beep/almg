# 7brew Weekly Count

A React + Vite app for tracking weekly store inventory: count every item,
flag what's low, and copy a ready-to-send order list.

## Deploying to Vercel

This app lives in a subfolder of the `almg` repo, alongside the landscaping
site at the repo root. To deploy it as its own site:

1. In Vercel, **Add New → Project** and import the `almg` repo.
2. Set **Root Directory** to `brew-inventory`. This is the important step —
   without it Vercel builds the repo root and gets the landscaping site.
3. Leave the rest alone. Vercel detects Vite and uses `npm run build` → `dist/`.
4. Deploy.

Every later push to `main` redeploys automatically. Adding this subfolder does
not affect the existing landscaping deployment, which builds from the repo root.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

Output goes to `dist/` — deployable on any static host.

## Data storage

Counts are saved in the browser's `localStorage`, so **each device keeps its
own separate counts**. Sharing the URL with someone gives them their own copy
of the sheet, not a view of yours — two people counting at once will not see
each other's numbers.

If you later want one shared live count across devices, that needs a backend.
Supabase's free tier is the usual fit: a single `items` table plus its realtime
subscription would replace the `loadLocal` / `saveLocal` calls in `src/App.jsx`.

## Features

- **Count sheet** — per-item counters with unit sets (Boxes/Sleeves,
  Cases/Cans, etc), category grouping, and a counted/left/low filter.
- **Order list** — the cart button collects every item at or below its low
  threshold, grouped by category, marked `OUT` or `LOW`, with a
  copy-to-clipboard export formatted for a text or email.
- **History** — save a week's count to keep a snapshot; each saved week can be
  deleted with a tap-to-confirm trash button.
- **Undo/redo** and a **reset** that zeroes every count without dropping items.

## Project structure

```
src/
  App.jsx       — all app logic + UI
  main.jsx      — React entry point
  index.css     — Tailwind imports
index.html      — HTML shell
tailwind.config.js
vite.config.js
```

## Editing the item list

The starting inventory (items, categories, unit types) lives in the
`DEFAULT_ITEMS` array near the top of `src/App.jsx`. Add, remove, or
re-categorize items there.

Note that `DEFAULT_ITEMS` is only the *starting* list — once the app has run
once, the live list is whatever is in `localStorage`. Editing `DEFAULT_ITEMS`
won't change a sheet that's already in use.
