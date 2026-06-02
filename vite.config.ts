import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves this project from /<repo-name>/, so assets must be
// resolved against that base. Locally (dev) the base is "/".
const base = process.env.GITHUB_PAGES ? "/plant-water-schedule/" : "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa-icon.svg"],
      manifest: {
        name: "Planty Care",
        short_name: "Planty Care",
        description:
          "Track plant watering and care schedules, reminders, and history.",
        theme_color: "#14191b",
        background_color: "#14191b",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Playwright specs in e2e/ run under Playwright, not Vitest.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
