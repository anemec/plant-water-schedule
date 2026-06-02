import { useCallback, useEffect, useState } from "react";

const KEY = "plantycare.textSize";

/**
 * Accessibility toggle for extra-large text. Adds/removes a class on <html>
 * (see index.css) and remembers the choice.
 */
export function useTextSize(): { large: boolean; toggle: () => void } {
  const [large, setLarge] = useState<boolean>(
    () => localStorage.getItem(KEY) === "1",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("text-xl-mode", large);
    localStorage.setItem(KEY, large ? "1" : "0");
  }, [large]);

  const toggle = useCallback(() => setLarge((v) => !v), []);
  return { large, toggle };
}
