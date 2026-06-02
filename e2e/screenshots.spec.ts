import { test, type Page } from "@playwright/test";

const DAY = 24 * 60 * 60 * 1000;

/** Seed localStorage with a few plants showing different care-task states. */
function seed(theme: "dark" | "light") {
  const now = Date.now();
  const plants = [
    {
      id: "a",
      name: "Monstera",
      species: "Monstera deliciosa",
      emoji: "🍃",
      image: null,
      tasks: [
        { type: "water", intervalDays: 7, lastDone: now },
        { type: "fertilize", intervalDays: 30, lastDone: now - 35 * DAY },
      ],
      reminderDays: [1, 4],
      reminderTime: "09:00",
    },
    {
      id: "b",
      name: "Pothos",
      species: "Epipremnum aureum",
      emoji: "🌿",
      image: null,
      tasks: [{ type: "water", intervalDays: 7, lastDone: now - 7 * DAY }],
      reminderDays: [],
      reminderTime: "09:00",
    },
    {
      id: "c",
      name: "Bird of Paradise",
      species: "Strelitzia",
      emoji: "🌸",
      image: null,
      tasks: [
        { type: "water", intervalDays: 7, lastDone: now - 10 * DAY },
        { type: "rotate", intervalDays: 14, lastDone: now - 4 * DAY },
      ],
      reminderDays: [2, 5],
      reminderTime: "08:00",
    },
  ];
  const history = [
    { id: "h1", plantId: "a", plantName: "Monstera", taskType: "water", at: now },
    {
      id: "h2",
      plantId: "b",
      plantName: "Pothos",
      taskType: "fertilize",
      at: now - 2 * DAY,
    },
  ];
  return { theme, state: { plants, history } };
}

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 900 },
} as const;

async function shoot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}

for (const theme of ["dark", "light"] as const) {
  test(`screenshots — ${theme}`, async ({ page }) => {
    await page.addInitScript((data) => {
      localStorage.setItem("plantycare.theme", data.theme);
      localStorage.setItem("plantycare.v2", JSON.stringify(data.state));
    }, seed(theme));

    // Mobile (primary target device).
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/");
    await page.getByRole("heading", { name: "Planty Care" }).waitFor();
    await shoot(page, `${theme}-plants-mobile`);

    const nav = page.getByRole("navigation", { name: /main sections/i });
    await nav.getByRole("button", { name: /add/i }).click();
    await shoot(page, `${theme}-add-mobile`);

    await nav.getByRole("button", { name: /history/i }).click();
    await shoot(page, `${theme}-history-mobile`);

    // Desktop.
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/");
    await page.getByRole("heading", { name: "Planty Care" }).waitFor();
    await shoot(page, `${theme}-plants-desktop`);
  });
}
