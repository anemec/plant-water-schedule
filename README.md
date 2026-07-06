# The Journal of Hendrick Hamel

A modern, mobile-friendly retelling of the story of **Hendrick Hamel** — the
Dutch East India Company bookkeeper who was shipwrecked on Jeju in 1653 and
held in the kingdom of Joseon for thirteen years. On his escape he wrote the
**first Western eyewitness account of Korea** (published 1668).

Built as a fast, accessible single-page site and deployed to **GitHub Pages**.

![React](https://img.shields.io/badge/React-19-149eca) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Tests](https://img.shields.io/badge/tests-Vitest%20%2B%20Playwright-6da744)

## Screenshots

Captured automatically in CI by Playwright on every push to `main`
(see `.github/workflows/e2e.yml`).

| Dark (midnight chart) | Light (parchment) |
| --- | --- |
| ![Dark theme, mobile](docs/screenshots/mobile-dark.png) | ![Light theme, mobile](docs/screenshots/mobile-light.png) |

## About the content

The site presents the history in a few parts:

- **The Story** — a short editorial narrative: the bookkeeper, the wreck on
  Quelpaert (Jeju), the interpreter Jan Janse Weltevree (Park Yeon), and the
  escape of 1666.
- **Timeline** — the thirteen-year course from Gorinchem to shipwreck, captivity
  and return, 1630–1692.
- **The Kingdom** — the subjects Hamel documented in his "Description of the
  Kingdom of Korea": the land, the court, law, belief, daily life, trade, war
  and learning.
- **Legacy & About** — why the account mattered, with links to sources.

The text is an original, plain-language retelling based on the historical
record; it summarises Hamel's report rather than reproducing the manuscript
verbatim. It is offered as an open tribute to and continuation of
[Henny Savenije's long-running Hendrick Hamel archive](https://www.hendrick-hamel.henny-savenije.pe.kr/),
which remains the definitive reference for the full translated text and primary
sources. Hamel's 1668 account is in the public domain.

## Design

- **Mobile-first**, responsive from 320px up, with a slim sticky header, a
  full-screen mobile menu, and a reading-progress bar.
- **Two themes** — a dark "midnight sea chart" (default) and a light "parchment"
  theme, remembered in `localStorage` and applied before first paint.
- **Editorial typography** using Fraunces (display) and Newsreader (body).
- **Accessible** — semantic landmarks, a skip link, keyboard-focus rings, and
  full support for `prefers-reduced-motion`.
- Installable as a **PWA** and works offline after first visit.

## Tech

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **Tailwind CSS v4**
- **Vitest** + Testing Library for unit tests; **Playwright** for E2E and
  screenshots

## Develop

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm test           # unit tests
npm run e2e        # Playwright E2E + screenshots
npm run lint
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which runs the
tests, builds with the GitHub Pages base path, and publishes `dist/` to GitHub
Pages.
