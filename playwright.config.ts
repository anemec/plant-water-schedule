import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

// Some sandboxed environments pre-install Chromium at a fixed path whose
// version may not match what @playwright/test expects. Use it when present;
// in CI the workflow runs `playwright install`, so let Playwright resolve it.
const localChromium = "/opt/pw-browsers/chromium";
const executablePath = existsSync(localChromium) ? localChromium : undefined;

/**
 * E2E + screenshot tests. These need a real browser, so they run in CI
 * (GitHub Actions), where Playwright can download Chromium. They are kept
 * separate from the Vitest unit tests in src/.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["list"]]
    : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
  ],
  // Build once, then preview the static output (closest to production).
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
