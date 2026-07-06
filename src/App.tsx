import { Nav, type NavLink } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Story } from "./components/Story";
import { Timeline } from "./components/Timeline";
import { Kingdom } from "./components/Kingdom";
import { Legacy } from "./components/Legacy";
import { Footer } from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import { useActiveSection, useScrollProgress } from "./hooks/useScroll";

const LINKS: NavLink[] = [
  { id: "story", label: "The Story" },
  { id: "timeline", label: "Timeline" },
  { id: "kingdom", label: "The Kingdom" },
  { id: "legacy", label: "Legacy" },
  { id: "about", label: "About" },
];

export default function App() {
  const { theme, toggle } = useTheme();
  const progress = useScrollProgress();
  const active = useActiveSection(LINKS.map((l) => l.id));

  return (
    <>
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-[#1a1206]"
      >
        Skip to content
      </a>
      <Nav
        links={LINKS}
        active={active}
        progress={progress}
        theme={theme}
        onToggleTheme={toggle}
      />
      <main>
        <Hero />
        <Story />
        <Timeline />
        <Kingdom />
        <Legacy />
      </main>
      <Footer />
    </>
  );
}
