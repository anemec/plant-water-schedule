import type { CareType, Preset } from "../types";
import type { IconName } from "../components/ui/Icon";

/** Display metadata for each care task type. */
export const CARE_META: Record<
  CareType,
  { label: string; verb: string; icon: IconName; defaultInterval: number }
> = {
  water: { label: "Water", verb: "Watered", icon: "water", defaultInterval: 7 },
  fertilize: {
    label: "Fertilize",
    verb: "Fertilized",
    icon: "fertilize",
    defaultInterval: 30,
  },
  rotate: { label: "Rotate", verb: "Rotated", icon: "rotate", defaultInterval: 14 },
  repot: { label: "Repot", verb: "Repotted", icon: "repot", defaultInterval: 365 },
};

/** Care types in display order. */
export const CARE_TYPES: CareType[] = ["water", "fertilize", "rotate", "repot"];

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
