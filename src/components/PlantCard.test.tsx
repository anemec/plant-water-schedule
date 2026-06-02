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
    intervalDays: 7,
    lastWatered: null,
    image: null,
    reminderDays: [],
    reminderTime: "09:00",
    ...overrides,
  };
}

const noop = () => {};

describe("PlantCard", () => {
  it("renders the plant name, species and a 'water today' status", () => {
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onWater={noop}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    expect(screen.getByText("Pothos")).toBeInTheDocument();
    expect(screen.getByText("Epipremnum aureum")).toBeInTheDocument();
    expect(screen.getByText(/water today/i)).toBeInTheDocument();
  });

  it("shows the emoji fallback when there is no image", () => {
    render(
      <PlantCard
        plant={makePlant({ image: null })}
        now={Date.now()}
        onWater={noop}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("calls onWater with the plant id", async () => {
    const onWater = vi.fn();
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onWater={onWater}
        onEdit={noop}
        onRemove={noop}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /water now/i }));
    expect(onWater).toHaveBeenCalledWith("p1");
  });

  it("exposes accessible edit and remove controls", async () => {
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    render(
      <PlantCard
        plant={makePlant()}
        now={Date.now()}
        onWater={noop}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /edit schedule for pothos/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /remove pothos/i }),
    );
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
