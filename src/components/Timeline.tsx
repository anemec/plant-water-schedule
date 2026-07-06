import { TIMELINE } from "../data/content";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";

export function Timeline() {
  return (
    <section id="timeline" className="scroll-mt-20 bg-surface/40 py-20 sm:py-28">
      <div className="u-wrap">
        <Reveal className="u-prose">
          <p className="kicker mb-4">
            <Icon name="compass" size={15} />
            Thirteen years
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">
            A castaway's course, 1630–1692
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            From a fortress town in Holland to a shipwreck off Jeju, thirteen
            years inside a closed kingdom, and a small boat back to the world.
          </p>
        </Reveal>

        <ol className="relative mt-14 border-l border-line pl-6 sm:pl-8">
          {TIMELINE.map((e, i) => (
            <Reveal
              as="li"
              key={i}
              className="relative pb-10 last:pb-0"
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
            >
              {/* node */}
              <span
                className="absolute -left-[calc(1.5rem+7px)] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-brass bg-canvas sm:-left-[calc(2rem+7px)]"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-2xl font-semibold text-brass">
                  {e.year}
                </span>
                {e.date && (
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {e.date}
                  </span>
                )}
                <span className="ml-auto font-sans text-xs uppercase tracking-wider text-ink-faint">
                  {e.place}
                </span>
              </div>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                {e.title}
              </h3>
              <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-soft">
                {e.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
