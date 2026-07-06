import { test, expect } from "@playwright/test";

test.describe("The Journal of Hendrick Hamel", () => {
  test("loads with the correct title and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Hendrick Hamel/i);
    await expect(
      page.getByRole("heading", { level: 1, name: /Hendrick Hamel/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Shipwrecked in the Hermit Kingdom/i),
    ).toBeVisible();
  });

  test("shows the main content sections", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /What Hamel recorded of Joseon/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /A castaway's course/i }),
    ).toBeVisible();
  });

  test("theme toggle switches between dark and light", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: /Switch to light theme/i }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("desktop navigation jumps to a section", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "Timeline", exact: true }).click();
    await expect(page).toHaveURL(/#timeline$/);
    await expect(
      page.getByRole("heading", { name: /A castaway's course/i }),
    ).toBeInViewport();
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await page.getByRole("link", { name: "The Kingdom", exact: true }).click();
    await expect(page).toHaveURL(/#kingdom$/);
  });
});
