import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import type { Theme } from "../hooks/useTheme";

export interface NavLink {
  id: string;
  label: string;
}

interface NavProps {
  links: NavLink[];
  active: string;
  progress: number;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Nav({ links, active, progress, theme, onToggleTheme }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[color-mix(in_oklab,var(--c-canvas)_86%,transparent)] backdrop-blur-md border-b border-line"
          : "border-b border-transparent"
      }`}
    >
      <div className="u-wrap flex h-14 items-center justify-between gap-4 sm:h-16">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-ink no-underline"
          onClick={() => setOpen(false)}
        >
          <span className="text-brass">
            <Icon name="compass" size={26} />
          </span>
          <span className="text-[0.98rem] font-semibold leading-none tracking-tight sm:text-[1.05rem]">
            Hendrick&nbsp;Hamel
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`rounded-full px-3.5 py-1.5 font-sans text-[0.82rem] font-medium no-underline transition-colors ${
                active === l.id
                  ? "bg-surface-2 text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "light"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Reading progress bar */}
      <div
        className="h-0.5 origin-left bg-brass transition-transform duration-150"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden="true"
      />

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-40 md:hidden ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-canvas/95 backdrop-blur-lg transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          className="relative flex flex-col gap-1 px-6 pt-6"
          aria-label="Sections"
        >
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`border-b border-line py-4 font-display text-2xl no-underline transition-transform duration-300 ${
                active === l.id ? "text-brass" : "text-ink"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: open ? `${i * 45 + 60}ms` : "0ms" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
