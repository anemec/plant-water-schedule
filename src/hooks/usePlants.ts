import { useCallback, useEffect, useRef, useState } from "react";
import type { AppState, HistoryEntry, Plant, Preset } from "../types";
import { loadState, saveState } from "../lib/storage";
import { lookupPlant } from "../lib/wiki";
import { uid } from "../lib/util";

const DEFAULT_TIME = "09:00";

export interface PlantActions {
  addPreset: (preset: Preset) => void;
  addCustomPlant: (input: {
    name: string;
    species?: string;
    image?: string | null;
  }) => boolean;
  removePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  updateSchedule: (id: string, patch: Partial<Plant>) => void;
  clearHistory: () => void;
  hasPlantNamed: (name: string) => boolean;
}

export function usePlants(): {
  plants: Plant[];
  history: HistoryEntry[];
  actions: PlantActions;
} {
  const [state, setState] = useState<AppState>(() => loadState());

  // Persist on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Keep a ref so callbacks can read current plants without re-creating.
  const plantsRef = useRef(state.plants);
  plantsRef.current = state.plants;

  const hasPlantNamed = useCallback(
    (name: string) =>
      plantsRef.current.some(
        (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
      ),
    [],
  );

  const addCustomPlant: PlantActions["addCustomPlant"] = useCallback(
    ({ name, species = "", image = null }) => {
      const trimmed = name.trim();
      if (!trimmed || hasPlantNamed(trimmed)) return false;
      const plant: Plant = {
        id: uid(),
        name: trimmed,
        species,
        emoji: "🪴",
        intervalDays: 7,
        lastWatered: null,
        image,
        reminderDays: [],
        reminderTime: DEFAULT_TIME,
      };
      setState((s) => ({ ...s, plants: [...s.plants, plant] }));
      return true;
    },
    [hasPlantNamed],
  );

  const addPreset: PlantActions["addPreset"] = useCallback((preset) => {
    if (
      plantsRef.current.some(
        (p) => p.name.toLowerCase() === preset.name.toLowerCase(),
      )
    ) {
      return;
    }
    const id = uid();
    const plant: Plant = {
      id,
      name: preset.name,
      species: preset.species,
      emoji: preset.emoji,
      intervalDays: preset.intervalDays,
      lastWatered: null,
      image: null,
      reminderDays: [],
      reminderTime: DEFAULT_TIME,
    };
    setState((s) => ({ ...s, plants: [...s.plants, plant] }));

    // Fetch a photo in the background and patch it in.
    void lookupPlant(preset.wikiTitle).then((info) => {
      if (!info?.image) return;
      setState((s) => ({
        ...s,
        plants: s.plants.map((p) =>
          p.id === id ? { ...p, image: info.image } : p,
        ),
      }));
    });
  }, []);

  const removePlant: PlantActions["removePlant"] = useCallback((id) => {
    setState((s) => ({ ...s, plants: s.plants.filter((p) => p.id !== id) }));
  }, []);

  const waterPlant: PlantActions["waterPlant"] = useCallback((id) => {
    setState((s) => {
      const plant = s.plants.find((p) => p.id === id);
      if (!plant) return s;
      const at = Date.now();
      const entry: HistoryEntry = {
        id: uid(),
        plantId: plant.id,
        plantName: plant.name,
        emoji: plant.emoji,
        at,
      };
      return {
        plants: s.plants.map((p) =>
          p.id === id ? { ...p, lastWatered: at } : p,
        ),
        history: [entry, ...s.history],
      };
    });
  }, []);

  const updateSchedule: PlantActions["updateSchedule"] = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        plants: s.plants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    },
    [],
  );

  const clearHistory: PlantActions["clearHistory"] = useCallback(() => {
    setState((s) => ({ ...s, history: [] }));
  }, []);

  return {
    plants: state.plants,
    history: state.history,
    actions: {
      addPreset,
      addCustomPlant,
      removePlant,
      waterPlant,
      updateSchedule,
      clearHistory,
      hasPlantNamed,
    },
  };
}
