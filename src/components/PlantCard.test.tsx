import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Plant } from "../types";
import { PlantCard } from "./PlantCard";

function makePlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: "p1",
    name: "Pothos",
    species: "Epipremnum aureum",
    emoji: "🌿",
    image: null,
    tasks: [
      { type: "water", intervalDays: 7, lastDone: null },
      { type: "fertilize", intervalDays: 30, lastDone: null },
    ],
    reminderDays: [],
    reminderTime: "09:00",
    ...overrides,
  };
}

const noop = () => {};

describe("PlantCard", () => {
  it("renders the plant name, species and a row per care task", () => {
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onDoTask={noop}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    expect(screen.getByText("Pothos")).toBeInTheDocument();
    expect(screen.getByText("Epipremnum aureum")).toBeInTheDocument();
    expect(screen.getByText("Water")).toBeInTheDocument();
    expect(screen.getByText("Fertilize")).toBeInTheDocument();
    // Never-done tasks read as "Due today".
    expect(screen.getAllByText(/due today/i).length).toBeGreaterThanOrEqual(2);
  });

  it("shows the emoji fallback when there is no image", () => {
    render(
      <PlantCard
        plant={makePlant({ image: null })}
        now={Date.now()}
        onDoTask={noop}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("calls onDoTask with the plant id and task type", async () => {
    const onDoTask = vi.fn();
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onDoTask={onDoTask}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /water now/i }));
    expect(onDoTask).toHaveBeenCalledWith("p1", "water");
    await userEvent.click(screen.getByRole("button", { name: /fertilize now/i }));
    expect(onDoTask).toHaveBeenCalledWith("p1", "fertilize");
  });

  it("exposes accessible edit and remove controls", async () => {
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onDoTask={noop}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /edit care for pothos/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /remove pothos/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
