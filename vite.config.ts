import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves this project from /<repo-name>/, so assets must be
// resolved against that base. Locally (dev) the base is "/".
const base = process.env.GITHUB_PAGES ? "/plant-water-schedule/" : "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Playwright specs in e2e/ run under Playwright, not Vitest.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
