import { test } from "@playwright/test";

/**
 * Captures reference screenshots (mobile + desktop, dark + light) so the UI can
 * be reviewed on a phone via the repo file browser. Saved to e2e/screenshots/
 * and published to docs/screenshots/ by CI.
 */

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
];

async function settle(page: import("@playwright/test").Page) {
  // Reveal-on-scroll uses IntersectionObserver; a full-page screenshot doesn't
  // scroll, so force every reveal element into its visible state up front.
  await page.evaluate(() => {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("is-visible"));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

for (const vp of viewports) {
  for (const theme of ["dark", "light"] as const) {
    test(`screenshot — ${vp.name} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("hamel.theme", t as string);
        } catch {
          /* ignore */
        }
      }, theme);
      await page.goto("/");
      await settle(page);
      await page.screenshot({
        path: `e2e/screenshots/${vp.name}-${theme}.png`,
        fullPage: true,
      });
    });
  }
}
