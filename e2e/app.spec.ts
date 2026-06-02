import { test, expect } from "@playwright/test";

test.describe("Planty Care", () => {
  test("adds a preset plant end-to-end", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/no plants yet/i)).toBeVisible();

    const nav = page.getByRole("navigation", { name: /main sections/i });
    await nav.getByRole("button", { name: /add/i }).click();
    await page.getByRole("button", { name: /pothos/i }).click();

    await expect(page.getByRole("heading", { name: "Pothos" })).toBeVisible();
  });

  test("waters a plant and records it in history", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /main sections/i });

    await nav.getByRole("button", { name: /add/i }).click();
    await page.getByRole("button", { name: /monstera/i }).click();
    await page.getByRole("button", { name: /water now/i }).click();

    await nav.getByRole("button", { name: /history/i }).click();
    await expect(page.getByText("Monstera")).toBeVisible();
    await expect(page.getByText(/today/i)).toBeVisible();
  });

  test("toggles between dark and light themes", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("changes the text size", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /change text size/i }).click();
    await expect(page.locator("html")).toHaveClass(/scale-large/);
  });
});
