import { KINGDOM_TOPICS } from "../data/content";
import { Reveal } from "./Reveal";
import { Icon, type IconName } from "./Icon";

export function Kingdom() {
  return (
    <section id="kingdom" className="u-wrap scroll-mt-20 py-20 sm:py-28">
      <Reveal className="u-prose">
        <p className="kicker mb-4">
          <Icon name="map" size={15} />
          A description of the kingdom
        </p>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">
          What Hamel recorded of Joseon
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          The second half of Hamel's report set aside the shipwreck and set out
          to describe the country itself — its land, its rulers, its faith and
          its daily life — for readers who had never heard of it.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KINGDOM_TOPICS.map((t, i) => (
          <Reveal
            as="article"
            key={t.id}
            className="card group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1"
            style={{ transitionDelay: `${(i % 3) * 60}ms` }}
          >
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-brass/40 bg-brass/10 text-brass">
              <Icon name={t.icon as IconName} size={22} />
            </span>
            <h3 className="font-display text-xl font-semibold text-ink">
              {t.title}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{t.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
