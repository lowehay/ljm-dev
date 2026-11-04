"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { WarmTooltipGroup } from "./WarmTooltip/WarmTooltip";
import { OPEN_PALETTE_EVENT } from "./events";
import BackgroundToggle from "./BackgroundToggle";
import MusicToggle from "./MusicToggle";
import { site } from "../site";
import GooeyNav from "./GooeyNav/GooeyNav";
import { useHardwareWebGL } from "./useHardwareWebGL";
import { useTheme } from "./useTheme";

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

  const handleNavClick = () => {
    setIsOpen(false);
  };

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
    <header ref={headerRef} className="sticky top-0 z-50 py-3 mb-8">
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

          <div className="flex items-center">
            {/* Opens the command palette; the shortcut works anywhere, this just makes it discoverable */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              aria-label="Open command palette"
              className="hidden lg:flex items-center gap-1 mr-1 px-2 py-1 rounded-md border border-line text-[11px] font-mono text-muted hover:text-fg hover:border-line-strong transition"
            >
              <kbd>⌘K</kbd>
            </button>
            {site.music && <MusicToggle src={site.music} />}
            {/* Grouped so that once one tooltip is open, moving to the next icon shows its tooltip instantly */}
            <WarmTooltipGroup>
              <BackgroundToggle />
              <ThemeToggle />
            </WarmTooltipGroup>
          </div>

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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
