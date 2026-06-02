import type { SVGProps } from "react";
import type { ReactNode } from "react";

export type IconName =
  | "leaf"
  | "water"
  | "fertilize"
  | "rotate"
  | "repot"
  | "plant"
  | "add"
  | "explore"
  | "history"
  | "edit"
  | "trash"
  | "bell"
  | "bellOff"
  | "check"
  | "clock"
  | "warning"
  | "book"
  | "sun"
  | "moon"
  | "textSize"
  | "search"
  | "close"
  | "sparkle"
  | "eye"
  | "camera";

const paths: Record<IconName, ReactNode> = {
  leaf: (
    <>
      <path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16Z" />
      <path d="M4 20C9 14 13.5 10 19 8" />
    </>
  ),
  water: <path d="M12 3c4 5 6.5 8.5 6.5 12a6.5 6.5 0 0 1-13 0C5.5 11.5 8 8 12 3Z" />,
  fertilize: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v5l-4.5 9A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3l-4.5-9V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5" />
      <path d="M4 4v4.5h4.5" />
      <path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.5" />
      <path d="M20 20v-4.5h-4.5" />
    </>
  ),
  repot: (
    <>
      <path d="M5 10h14l-1.4 9a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 10Z" />
      <path d="M4 10h16" />
      <path d="M12 10V6" />
      <path d="M12 7C10.5 5 8 5 6.5 5.5 6.8 7.5 9.5 8.5 12 7Z" />
    </>
  ),
  plant: (
    <>
      <path d="M7 14h10l-1 6.5a1 1 0 0 1-1 .9H9a1 1 0 0 1-1-.9L7 14Z" />
      <path d="M6 14h12" />
      <path d="M12 14c0-4 3-7.5 8-7.5 0 4-3 7.5-8 7.5Z" />
      <path d="M12 14c0-3-2.5-6-7-6 0 3 2.5 6 7 6Z" />
    </>
  ),
  add: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4.5l3 1.8" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 16v4Z" />
      <path d="M14 7l3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  bellOff: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
      <path d="M3 3l18 18" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4l9 16H3L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
  book: (
    <>
      <path d="M5 5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2V5Z" />
      <path d="M19 18H7" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />,
  textSize: (
    <>
      <path d="M2.5 19L7.5 6l5 13" />
      <path d="M4.2 14.7h6.6" />
      <path d="M16 14.6a2.5 2.5 0 1 0 2.4 3.1" />
      <path d="M18.6 14.5V19" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
};

/** Cohesive line icon. Sizes to the current font (1em); override with size-*. */
export function Icon({
  name,
  className,
  ...rest
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
