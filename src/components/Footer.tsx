import { SITE } from "../data/content";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer id="about" className="scroll-mt-20 border-t border-line">
      <div className="u-wrap py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="u-prose">
            <p className="kicker mb-4">
              <Icon name="anchor" size={15} />
              About this edition
            </p>
            <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              A modern reading of an old journal
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              This is an open, mobile-friendly re-presentation of the story of
              Hendrick Hamel and his 1668 report — the first eyewitness account
              of Korea written by a European. The narrative here is a
              plain-language retelling drawn from the historical record; it
              summarises Hamel's account rather than reproducing the manuscript
              verbatim.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              It is built as a tribute to, and continuation of,{" "}
              <a
                href={SITE.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brass underline decoration-brass/40 underline-offset-2 hover:decoration-brass"
              >
                {SITE.sourceName}
                <Icon name="external" size={14} />
              </a>
              , a long-running scholarly resource devoted to Hamel's voyage. For
              the full translated text and primary sources, that archive remains
              the definitive reference.
            </p>
          </div>

          <div className="md:pl-6">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Further reading
            </h3>
            <ul className="mt-4 space-y-3 font-sans text-sm">
              <li>
                <a
                  href={SITE.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-soft no-underline hover:text-ink"
                >
                  Hamel archive (H. Savenije)
                  <Icon name="external" size={13} />
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Hendrick_Hamel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-soft no-underline hover:text-ink"
                >
                  Hendrick Hamel — Wikipedia
                  <Icon name="external" size={13} />
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Jan_Jansz_Weltevree"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-soft no-underline hover:text-ink"
                >
                  Jan Janse Weltevree (Park Yeon)
                  <Icon name="external" size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-sans text-xs text-ink-faint sm:flex-row sm:items-center">
          <p className="flex items-center gap-2">
            <Icon name="compass" size={15} />
            The Journal of Hendrick Hamel · 1653–1666
          </p>
          <p>
            Open source · content in the public domain · built for reading on
            any device.
          </p>
        </div>
      </div>
    </footer>
  );
}
