import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "plantycare.theme";

function initialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  return saved === "light" ? "light" : "dark"; // default dark
}

/**
 * Light/dark theme, defaulting to dark. Applies [data-theme] on <html>
 * (see index.css) and remembers the choice.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggle };
}
