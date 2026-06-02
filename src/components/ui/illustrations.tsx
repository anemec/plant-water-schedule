// Simple hand-drawn botanical line illustrations. Decorative (aria-hidden);
// they inherit color via `currentColor`, so set text-* on the parent.

interface Props {
  className?: string;
}

const common = {
  viewBox: "0 0 96 96",
  fill: "none" as const,
  "aria-hidden": true,
};

export function Sprout({ className }: Props) {
  return (
    <svg {...common} className={className}>
      <g
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M48 82 V44" />
        <path
          d="M48 56 C 34 56 24 46 26 32 C 42 32 50 42 48 56 Z"
          fill="currentColor"
          fillOpacity={0.18}
        />
        <path
          d="M48 50 C 62 50 72 40 70 26 C 54 26 46 36 48 50 Z"
          fill="currentColor"
          fillOpacity={0.18}
        />
        <path d="M30 82 H66" />
      </g>
    </svg>
  );
}

export function PottedPlant({ className }: Props) {
  return (
    <svg {...common} className={className}>
      <g
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M48 54 C 34 44 30 26 40 14 C 52 24 54 42 48 54 Z"
          fill="currentColor"
          fillOpacity={0.18}
        />
        <path
          d="M48 54 C 62 44 66 26 56 14 C 44 24 42 42 48 54 Z"
          fill="currentColor"
          fillOpacity={0.18}
        />
        <path d="M48 56 V18" />
        <path
          d="M32 58 H64 L60 84 H36 Z"
          fill="currentColor"
          fillOpacity={0.12}
        />
        <path d="M28 52 H68 V58 H28 Z" fill="currentColor" fillOpacity={0.12} />
      </g>
    </svg>
  );
}

export function WateringCan({ className }: Props) {
  return (
    <svg {...common} className={className}>
      <g
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M30 44 H62 L58 76 H34 Z"
          fill="currentColor"
          fillOpacity={0.14}
        />
        <path d="M62 50 L80 38 L84 46" />
        <path d="M30 48 C 22 48 18 40 24 34" />
        <path d="M40 44 V36 H52 V44" />
        <path d="M82 54 V60 M76 58 V64 M88 58 V64" />
      </g>
    </svg>
  );
}
