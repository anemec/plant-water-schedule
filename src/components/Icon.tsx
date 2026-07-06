/**
 * Small inline SVG icon set. Line-art style (currentColor stroke) to match the
 * cartographic feel and to keep the bundle free of icon-font dependencies.
 */

export type IconName =
  | "compass"
  | "anchor"
  | "map"
  | "crown"
  | "scale"
  | "lotus"
  | "house"
  | "ship"
  | "shield"
  | "quill"
  | "sun"
  | "moon"
  | "arrow-down"
  | "menu"
  | "close"
  | "external";

const paths: Record<IconName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13M6 20a8 8 0 0 1-3-6h3m9 6a8 8 0 0 0 3-6h-3M8 11h8" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  crown: (
    <>
      <path d="M4 8l3.5 3L12 6l4.5 5L20 8l-1.5 10h-13L4 8Z" />
      <path d="M5.5 18h13" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M6 20h12M4 8h16l-3.5 6h7M4 8l-3.5 6h7M8 8l4-3 4 3" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 20c-4 0-7-2.5-7-5 2.2 0 3.8.7 5 1.7C13.3 14 12 9 12 5c0 4-1.3 9 2 11.7C15.2 15.7 16.8 15 19 15c0 2.5-3 5-7 5Z" />
    </>
  ),
  house: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9M10 19v-5h4v5" />
    </>
  ),
  ship: (
    <>
      <path d="M3 15h18l-2.2 5H5.2L3 15Z" />
      <path d="M6 15V8l10 3.5M6 8l8-4v7M12 4v-1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </>
  ),
  quill: (
    <>
      <path d="M20 4c-8 1-12 5-14 11l3 3c6-2 10-6 11-14ZM4 20l4-4M9 15h.01" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  "arrow-down": <path d="M12 4v15m0 0-6-6m6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </>
  ),
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
