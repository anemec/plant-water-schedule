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
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "The Journal of Hendrick Hamel",
        short_name: "Hamel's Journal",
        description:
          "The first Western eyewitness account of Korea — a Dutch sailor's record of thirteen years shipwrecked in Joseon, 1653–1666.",
        theme_color: "#0d1620",
        background_color: "#0d1620",
        display: "standalone",
        icons: [
          {
            src: "favicon.svg",
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
