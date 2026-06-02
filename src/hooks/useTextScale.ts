import { useCallback, useEffect, useState } from "react";

export type TextScale = "normal" | "large" | "xlarge";

const KEY = "plantycare.textScale";
const ORDER: TextScale[] = ["normal", "large", "xlarge"];
export const SCALE_LABELS: Record<TextScale, string> = {
  normal: "Normal",
  large: "Large",
  xlarge: "Largest",
};

function initialScale(): TextScale {
  const saved = localStorage.getItem(KEY);
  return saved === "large" || saved === "xlarge" ? saved : "normal";
}

/**
 * Three-step text size, applied as a class on <html> (see index.css)
 * and remembered. `cycle` advances Normal → Large → Largest → Normal.
 */
export function useTextScale(): {
  scale: TextScale;
  cycle: () => void;
} {
  const [scale, setScale] = useState<TextScale>(initialScale);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("scale-large", "scale-xlarge");
    if (scale !== "normal") root.classList.add(`scale-${scale}`);
    localStorage.setItem(KEY, scale);
  }, [scale]);

  const cycle = useCallback(() => {
    setScale((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]);
  }, []);

  return { scale, cycle };
}
