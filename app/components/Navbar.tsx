"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import WarmTooltip, { WarmTooltipGroup } from "./WarmTooltip/WarmTooltip";
import { OPEN_PALETTE_EVENT, TOGGLE_MUSIC_EVENT } from "./events";
import { getBackground, setBackground } from "./useBackground";
import BackgroundToggle from "./BackgroundToggle";
import MusicToggle from "./MusicToggle";
import { site } from "../site";
import GooeyNav from "./GooeyNav/GooeyNav";
import { useHardwareWebGL } from "./useHardwareWebGL";
import { toggleTheme, useTheme } from "./useTheme";

const NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "notes", label: "Notes" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

// The gooey pill always sits on an item, so the desktop nav adds Home for the hero at the top of the page
const GOOEY_ITEMS = [{ id: "home", label: "Home" }, ...NAV_ITEMS];

// Neutral frame colors so the pill nav stays monochrome (the component's defaults are tinted)
const GOOEY_FRAME = {
  dark: { "--gn-frame": "rgba(23, 23, 23, 0.7)", "--gn-ink": "#fafafa", "--gn-muted": "rgba(250, 250, 250, 0.6)" },
  light: { "--gn-frame": "rgba(240, 240, 240, 0.8)", "--gn-ink": "#0a0a0a", "--gn-muted": "rgba(10, 10, 10, 0.6)" },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  // After a nav click, ignore scroll tracking briefly so the pill doesn't hop through every section on the way
  const lockUntilRef = useRef(0);
  const theme = useTheme() ?? "dark";
  const hardwareWebGL = useHardwareWebGL();
  const gooeyIndex = Math.max(0, GOOEY_ITEMS.findIndex((item) => item.id === activeId));

  // Reading progress: a hairline under the header that fills as the page scrolls
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  // On phones the header slides away while scrolling down and comes back when scrolling up
  const [tucked, setTucked] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  // Single-key shortcuts: T theme, B background, M music. Ignored while typing or with a modifier key held,
  // so they never fire inside the chat, the contact form, or the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
      const key = e.key.toLowerCase();
      if (key === "t") toggleTheme();
      else if (key === "b") setBackground(getBackground() === "grain" ? "pixel" : "grain");
      else if (key === "m" && site.music) window.dispatchEvent(new Event(TOGGLE_MUSIC_EVENT));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Phones only (below the 900px desktop nav): hide on the way down, show on the way up or near the top
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 899px)");
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      setTucked(phone.matches && delta > 0 && y > 80);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => !phone.matches && setTucked(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    phone.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      phone.removeEventListener("change", onResize);
    };
  }, []);

  // Close the mobile menu on Escape or a click outside the header
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  // Track the section currently under the top third of the viewport
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < lockUntilRef.current) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setActiveId(NAV_ITEMS[NAV_ITEMS.length - 1].id);

      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 py-3 mb-8 transition-transform duration-300 ${
        tucked && !isOpen ? "-translate-y-full" : ""
      }`}
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-fg/60 pointer-events-none"
      />
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-fg hover:opacity-80 transition">
          Lforlowe<span className="text-muted">.dev</span>
        </Link>

        <div className="flex items-center gap-2 min-[900px]:gap-4">
          {/* Desktop Nav: gooey pill follows the section in view. From 900px, the width all eight items need on one line */}
          {/* Wrapper handles hiding: GooeyNav's unlayered CSS would override a `hidden` class on the nav itself */}
          <div className="hidden min-[900px]:block">
            <GooeyNav
              items={GOOEY_ITEMS.map(({ id, label }) => ({ label, href: `#${id}` }))}
              activeIndex={gooeyIndex}
              onChange={(index) => {
                lockUntilRef.current = performance.now() + 1000;
                setActiveId(GOOEY_ITEMS[index].id);
              }}
              theme={theme}
              color={theme === "light" ? "#0a0a0a" : "#fafafa"}
              size="sm"
              frame
              particleCount={15}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect
              // Without a GPU the gooey shader stalls the page, so use the plain pills
              webgl={hardwareWebGL === true}
              style={GOOEY_FRAME[theme]}
            />
          </div>

          {/* Grouped so that once one tooltip is open, moving to the next icon shows its tooltip instantly */}
          <WarmTooltipGroup>
            <div className="flex items-center">
              {/* Opens the command palette; the shortcut works anywhere, this just makes it discoverable.
                  The tooltip adds Ctrl K, since the button shows the Mac shortcut */}
              <WarmTooltip
                content="Search and commands"
                shortcut="Ctrl K"
                side="bottom"
                surfaceColor="var(--color-fg)"
                inkColor="var(--color-canvas)"
                size="sm"
              >
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
                  aria-label="Open command palette"
                  className="hidden lg:flex items-center gap-1 mr-1 px-2 py-1 rounded-md border border-line text-[11px] font-mono text-muted hover:text-fg hover:border-line-strong transition"
                >
                  <kbd>⌘K</kbd>
                </button>
              </WarmTooltip>
              {/* The music button has its own hover panel (label and volume), so it doesn't get a tooltip too */}
              {site.music && <MusicToggle src={site.music} />}
              <BackgroundToggle />
              <ThemeToggle />
              {/* The scoper is the main way in for clients; from 1024px there's room for it beside the icons */}
              <Link
                href="/scope"
                className="hidden lg:inline-flex items-center ml-2 h-7 px-2.5 rounded-full bg-fg text-canvas text-[12px] font-medium whitespace-nowrap hover:opacity-85 transition"
              >
                Start a project
              </Link>
            </div>
          </WarmTooltipGroup>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="min-[900px]:hidden p-2 text-muted hover:text-fg transition"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: one frosted-glass panel that starts behind the logo row, so the transparent header and the
          menu read as a single surface instead of a solid block under a see-through bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-[900px]:hidden absolute inset-x-0 top-0 -z-10 pt-16 pb-6 px-6 bg-canvas/55 backdrop-blur-2xl border-b border-line/70"
          >
            <ul className="flex flex-col">
              {NAV_ITEMS.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.03 * i }}
                  className="border-t border-line/60 first:border-t-0"
                >
                  <a
                    href={`#${id}`}
                    onClick={handleNavClick}
                    aria-current={activeId === id ? "location" : undefined}
                    className={`flex items-baseline gap-3 py-3 text-base transition ${
                      activeId === id ? "text-fg" : "text-fg-soft hover:text-fg"
                    }`}
                  >
                    {/* Same numbering as the section labels on the page */}
                    <span className="text-xs font-mono text-muted">0{i + 1}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/scope"
              onClick={handleNavClick}
              className="mt-4 flex items-center justify-center h-11 rounded-full bg-fg text-canvas text-sm font-medium hover:opacity-85 transition"
            >
              Start a project
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
