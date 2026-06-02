# 🌱 Planty Care

A friendly app to track plant watering schedules, set reminders, and keep a
history of every watering. Built as a fast, accessible single-page app and
deployed to **GitHub Pages**.

![Tech](https://img.shields.io/badge/React-19-149eca) ![Tech](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Tech](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Tests](https://img.shields.io/badge/tests-Vitest-6da744)

## Features

- **My Plants** — every plant with a photo, watering status (water today /
  overdue / water in N days), last-watered time, and reminder summary. Sorted
  most-urgent first.
- **Quick add** built-ins: Pothos, Sansevieria, Bird of Paradise, Monstera.
- **Look up new plants** — search any plant and pull a photo + description from
  the **Wikipedia REST API** (no API key, CORS-friendly → works on static
  hosting).
- **Reminders** — pick weekdays + a time per plant; browser notifications fire
  while the page is open.
- **History** — a running, human-friendly log of every watering.
- **Accessible & mobile-first** — large, high-contrast type; an **A+** toggle
  for extra-large text; thumb-friendly bottom navigation; safe-area aware; full
  keyboard focus styling; respects reduced motion.

All data lives in your browser (`localStorage`); nothing is sent to a server.

## Tech stack

| Concern | Choice |
| --- | --- |
| Build / dev | **Vite 7** |
| UI | **React 19** + **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** (design tokens via `@theme`) |
| Tests | **Vitest** + **React Testing Library** (jsdom) |
| Linting | **ESLint 9** (flat config) + typescript-eslint |

### Architecture

```
src/
  lib/         pure logic — watering math, storage, Wikipedia client,
               notifications, formatting (heavily unit-tested)
  hooks/       usePlants (state + persistence), useReminders, useTextSize
  components/  presentational + feature components (ui/ holds primitives)
  data/        preset plants
  types.ts     shared domain types
```

The domain logic is split into small pure functions so it can be tested without
a DOM, and React components stay thin.

## Develop

```bash
npm install
npm run dev        # start the dev server
npm test           # run the test suite
npm run lint       # lint
npm run build      # type-check + production build → dist/
```

## Deploy to GitHub Pages

`.github/workflows/deploy-pages.yml` runs the tests, builds with the correct
base path (`/plant-water-schedule/`), and deploys on every push to `main`.
Enable it once under **Settings → Pages → Source: GitHub Actions**. The app
then lives at `https://<username>.github.io/plant-water-schedule/`.

> The Vite `base` is only applied when the `GITHUB_PAGES` env var is set (done
> in CI), so local dev still serves from `/`.

## Notes on reminders

Browser notifications fire only while the page is open. Always-on reminders
would need a Service Worker + Push API and a push server — out of scope for a
pure static site.
