import { Icon } from "./Icon";
import { SITE, HERO_FACTS } from "../data/content";

/** Decorative compass-rose + chart-lines backdrop drawn in SVG. */
function ChartBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-brass"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rosefade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* faint latitude/longitude grid */}
      <g stroke="currentColor" strokeOpacity="0.10" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" />
        ))}
      </g>
      {/* compass rose, upper right */}
      <g
        transform="translate(940 250)"
        stroke="currentColor"
        fill="none"
        strokeOpacity="0.5"
      >
        <circle r="150" strokeOpacity="0.18" />
        <circle r="112" strokeOpacity="0.28" strokeDasharray="2 8" />
        <circle r="150" fill="url(#rosefade)" stroke="none" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          const long = i % 4 === 0;
          const r1 = long ? 0 : 78;
          return (
            <line
              key={i}
              x1={Math.sin(a) * r1}
              y1={-Math.cos(a) * r1}
              x2={Math.sin(a) * 150}
              y2={-Math.cos(a) * 150}
              strokeOpacity={long ? 0.55 : 0.25}
            />
          );
        })}
        <path
          d="M0 -150 L26 0 L0 150 L-26 0 Z"
          fill="currentColor"
          fillOpacity="0.14"
          strokeOpacity="0.5"
        />
        <path
          d="M-150 0 L0 26 L150 0 L0 -26 Z"
          fillOpacity="0"
          strokeOpacity="0.35"
        />
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-14 sm:pt-16"
    >
      <ChartBackdrop />
      <div className="u-wrap relative py-16 sm:py-20">
        <p className="kicker mb-6">
          <Icon name="anchor" size={15} />
          The first Western account of Korea
        </p>

        <h1 className="max-w-3xl font-display text-[clamp(2.6rem,10vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
          The Journal of{" "}
          <span className="text-brass">Hendrick Hamel</span>
        </h1>

        <p className="mt-5 font-sans text-base font-medium uppercase tracking-[0.18em] text-ink-soft sm:text-lg">
          {SITE.subtitle}
        </p>

        <p className="u-prose mt-6 text-lg leading-relaxed text-ink-soft sm:text-xl">
          {SITE.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#who"
            className="inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 font-sans text-sm font-semibold text-[#1a1206] no-underline shadow-card transition-transform hover:-translate-y-0.5"
          >
            Read the story
            <Icon name="arrow-down" size={18} />
          </a>
          <a
            href="#timeline"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-sans text-sm font-semibold text-ink no-underline transition-colors hover:bg-surface-2"
          >
            See the timeline
          </a>
        </div>

        {/* Fact strip */}
        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {HERO_FACTS.map((f) => (
            <div key={f.label} className="border-t border-line pt-3">
              <dt className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {f.value}
              </dt>
              <dd className="mt-1 font-sans text-xs uppercase tracking-wider text-ink-faint">
                {f.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
