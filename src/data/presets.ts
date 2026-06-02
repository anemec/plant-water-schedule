import type { Preset } from "../types";

/** Built-in starter plants. */
export const PRESETS: readonly Preset[] = [
  {
    name: "Pothos",
    emoji: "🌿",
    species: "Epipremnum aureum",
    wikiTitle: "Epipremnum aureum",
    intervalDays: 7,
  },
  {
    name: "Sansevieria",
    emoji: "🪴",
    species: "Dracaena trifasciata",
    wikiTitle: "Sansevieria",
    intervalDays: 14,
  },
  {
    name: "Bird of Paradise",
    emoji: "🌸",
    species: "Strelitzia",
    wikiTitle: "Strelitzia",
    intervalDays: 7,
  },
  {
    name: "Monstera",
    emoji: "🍃",
    species: "Monstera deliciosa",
    wikiTitle: "Monstera deliciosa",
    intervalDays: 7,
  },
];

export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;
