# 🌱 Planty Care

A friendly web app to track your plant watering schedules, set reminders, and
keep a history of every watering. Built as a static site so it runs entirely in
your browser and deploys to **GitHub Pages** with no backend needed.

## Features

- **My Plants** — see every plant with a photo, when it was last watered, and a
  clear status badge (water today / overdue / water in N days). Plants are
  sorted with the most urgent first.
- **Quick add** from a built-in list: Pothos, Sansevieria, Bird of Paradise,
  and Monstera — each with a sensible default watering interval.
- **Look up & add new plants** — search any plant by name and the app fetches a
  photo and description from the **Wikipedia REST API** (no API key required,
  CORS-friendly, works on GitHub Pages).
- **Reminders** — pick the days of the week and a time for each plant. With
  notifications enabled, the app shows a desktop notification when it's time to
  water (keep the page open to receive alerts).
- **Watering history** — a running log of everything you've watered and when.
- **Easy to read** — large high-contrast text, big buttons, generous tap
  targets, and an **A+** toggle for extra-large text for low vision.

All data is stored locally in your browser (`localStorage`); nothing is sent to
a server.

## Run locally

It's a plain static site — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy-pages.yml` deploys the site
automatically on every push to `main`. To enable it once:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually). Your app will be live at
   `https://<your-username>.github.io/plant-water-schedule/`.

## Tech

Vanilla HTML, CSS, and JavaScript — no build step, no dependencies.

## Notes on reminders

Browser notifications fire while the page is open in a tab. For always-on
reminders you'd need a Service Worker with the Push API and a push server, which
is out of scope for a pure static GitHub Pages app.
