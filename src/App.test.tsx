import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { TIMELINE, KINGDOM_TOPICS, CHAPTERS } from "./data/content";

describe("App", () => {
  it("renders the site title and subtitle", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Hendrick Hamel/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Shipwrecked in the Hermit Kingdom/i)).toBeInTheDocument();
  });

  it("renders the primary navigation sections", () => {
    render(<App />);
    // Section headings from each major block.
    expect(screen.getByText(/What Hamel recorded of Joseon/i)).toBeInTheDocument();
    expect(screen.getByText(/A castaway's course/i)).toBeInTheDocument();
  });

  it("renders every timeline entry", () => {
    render(<App />);
    for (const entry of TIMELINE) {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
    }
  });

  it("renders every kingdom topic and story chapter", () => {
    render(<App />);
    for (const t of KINGDOM_TOPICS) {
      expect(screen.getByText(t.title)).toBeInTheDocument();
    }
    for (const c of CHAPTERS) {
      expect(screen.getByText(c.title)).toBeInTheDocument();
    }
  });

  it("provides a skip-to-content link for accessibility", () => {
    render(<App />);
    expect(screen.getByText(/Skip to content/i)).toBeInTheDocument();
  });
});
