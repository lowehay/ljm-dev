"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BackgroundToggle from "./BackgroundToggle";
import MusicToggle from "./MusicToggle";
import { site } from "../site";
import GooeyNav from "./GooeyNav/GooeyNav";
import { useTheme } from "./useTheme";

const NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
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

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Nav: gooey pill follows the section in view */}
          {/* Wrapper handles hiding: GooeyNav's unlayered CSS would override a `hidden` class on the nav itself */}
          <div className="hidden md:block">
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
              style={GOOEY_FRAME[theme]}
            />
          </div>

          <div className="flex items-center">
            {site.music && <MusicToggle src={site.music} />}
            <BackgroundToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted hover:text-fg transition"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-canvas/95 backdrop-blur-xl border-b border-line px-6 py-4 flex flex-col gap-4 text-sm text-fg-soft shadow-2xl">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={handleNavClick}
              aria-current={activeId === id ? "location" : undefined}
              className={`hover:text-fg transition py-1 ${activeId === id ? "text-fg" : ""}`}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
