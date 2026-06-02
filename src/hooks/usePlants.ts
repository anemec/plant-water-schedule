import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AppState,
  CareTask,
  CareType,
  HistoryEntry,
  Plant,
  Preset,
  Weekday,
} from "../types";
import { loadState, saveState } from "../lib/storage";
import { lookupPlant } from "../lib/wiki";
import { uid } from "../lib/util";

const DEFAULT_TIME = "09:00";

function waterTask(intervalDays: number): CareTask {
  return { type: "water", intervalDays, lastDone: null };
}

export interface PlantActions {
  addPreset: (preset: Preset) => void;
  addCustomPlant: (input: {
    name: string;
    species?: string;
    image?: string | null;
  }) => boolean;
  removePlant: (id: string) => void;
  /** Mark a care task done now (records history + updates lastDone). */
  doTask: (id: string, type: CareType) => void;
  /** Replace a plant's care tasks + watering reminder. */
  updatePlantCare: (
    id: string,
    patch: { tasks: CareTask[]; reminderDays: Weekday[]; reminderTime: string },
  ) => void;
  clearHistory: () => void;
  hasPlantNamed: (name: string) => boolean;
}

export function usePlants(): {
  plants: Plant[];
  history: HistoryEntry[];
  actions: PlantActions;
} {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

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
        image,
        tasks: [waterTask(7)],
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
      image: null,
      tasks: [waterTask(preset.intervalDays)],
      reminderDays: [],
      reminderTime: DEFAULT_TIME,
    };
    setState((s) => ({ ...s, plants: [...s.plants, plant] }));

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

  const doTask: PlantActions["doTask"] = useCallback((id, type) => {
    setState((s) => {
      const plant = s.plants.find((p) => p.id === id);
      if (!plant) return s;
      const at = Date.now();
      const entry: HistoryEntry = {
        id: uid(),
        plantId: plant.id,
        plantName: plant.name,
        taskType: type,
        at,
      };
      return {
        plants: s.plants.map((p) =>
          p.id === id
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.type === type ? { ...t, lastDone: at } : t,
                ),
              }
            : p,
        ),
        history: [entry, ...s.history],
      };
    });
  }, []);

  const updatePlantCare: PlantActions["updatePlantCare"] = useCallback(
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
      doTask,
      updatePlantCare,
      clearHistory,
      hasPlantNamed,
    },
  };
}
