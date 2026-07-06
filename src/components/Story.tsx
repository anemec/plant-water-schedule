import { CHAPTERS } from "../data/content";
import { Reveal } from "./Reveal";

export function Story() {
  return (
    <section id="story" className="u-wrap py-20 sm:py-28">
      <div className="flex flex-col gap-20 sm:gap-28">
        {CHAPTERS.map((ch, i) => (
          <article
            key={ch.id}
            id={ch.id}
            className="scroll-mt-24 md:grid md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] md:gap-10"
          >
            {/* Marginal chapter number / kicker */}
            <Reveal className="mb-4 md:mb-0 md:text-right">
              <span className="font-display text-4xl font-semibold text-brass/40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Reveal>

            <div className="u-prose">
              <Reveal>
                <p className="kicker mb-4">{ch.kicker}</p>
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.5rem]">
                  {ch.title}
                </h2>
                <p className="mt-5 font-display text-xl italic leading-relaxed text-ink-soft sm:text-2xl">
                  {ch.lede}
                </p>
              </Reveal>

              {ch.paragraphs.map((p, j) => (
                <Reveal key={j} style={{ transitionDelay: `${j * 80}ms` }}>
                  <p
                    className={`mt-6 text-lg leading-[1.8] text-ink-soft ${
                      i === 0 && j === 0 ? "dropcap" : ""
                    }`}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
