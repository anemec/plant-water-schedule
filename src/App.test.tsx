import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App (integration)", () => {
  beforeEach(() => {
    localStorage.clear();
    // No real network for the preset background photo fetch.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) }),
    );
  });

  it("shows an empty state and can add a preset plant end-to-end", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/no plants yet/i)).toBeInTheDocument();

    // Go to the Add tab and quick-add Pothos.
    const nav = screen.getByRole("navigation", { name: /main sections/i });
    await user.click(within(nav).getByRole("button", { name: /add/i }));

    await user.click(screen.getByRole("button", { name: /pothos/i }));

    // We're returned to My Plants and the card is shown.
    expect(
      await screen.findByRole("heading", { name: "Pothos" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /water now/i })).toBeInTheDocument();
  });

  it("waters a plant and logs it in history", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: /main sections/i });
    await user.click(within(nav).getByRole("button", { name: /add/i }));
    await user.click(screen.getByRole("button", { name: /monstera/i }));

    await user.click(await screen.findByRole("button", { name: /water now/i }));

    await user.click(within(nav).getByRole("button", { name: /history/i }));
    expect(screen.getByText("Monstera")).toBeInTheDocument();
    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  it("toggles the theme from the header control", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
