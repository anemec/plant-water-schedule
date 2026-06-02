import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

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
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Build once, then preview the static output (closest to production).
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
