import { LEGACY_POINTS } from "../data/content";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";

export function Legacy() {
  return (
    <section id="legacy" className="scroll-mt-20 bg-surface/40 py-20 sm:py-28">
      <div className="u-wrap">
        {/* Feature line */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-brass/40 text-brass">
            <Icon name="quill" size={24} />
          </span>
          <blockquote className="font-display text-2xl font-medium italic leading-snug tracking-tight sm:text-4xl">
            A bookkeeper's plain report became the first true map of Korea in the
            European mind.
          </blockquote>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {LEGACY_POINTS.map((p, i) => (
            <Reveal key={i} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="font-display text-3xl font-semibold text-brass/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
