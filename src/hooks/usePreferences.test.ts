import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheme } from "./useTheme";
import { useTextScale } from "./useTextScale";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark and applies it to <html>", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("toggles to light and persists the choice", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("plantycare.theme")).toBe("light");
  });

  it("restores a saved theme", () => {
    localStorage.setItem("plantycare.theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });
});

describe("useTextScale", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("defaults to normal with no scale class", () => {
    const { result } = renderHook(() => useTextScale());
    expect(result.current.scale).toBe("normal");
    expect(document.documentElement.classList.contains("scale-large")).toBe(
      false,
    );
  });

  it("cycles normal → large → xlarge → normal", () => {
    const { result } = renderHook(() => useTextScale());

    act(() => result.current.cycle());
    expect(result.current.scale).toBe("large");
    expect(document.documentElement.classList.contains("scale-large")).toBe(
      true,
    );

    act(() => result.current.cycle());
    expect(result.current.scale).toBe("xlarge");
    expect(document.documentElement.classList.contains("scale-xlarge")).toBe(
      true,
    );

    act(() => result.current.cycle());
    expect(result.current.scale).toBe("normal");
    expect(document.documentElement.className).toBe("");
  });
});
