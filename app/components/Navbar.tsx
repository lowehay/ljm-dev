"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    <header ref={headerRef} className="sticky top-0 z-50 backdrop-blur-md bg-canvas/80 border-b border-line/60 py-4 mb-8">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-white hover:opacity-80 transition">
          LJM<span className="text-muted">.dev</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeId === id ? "location" : undefined}
              className={`relative py-1 hover:text-white transition ${activeId === id ? "text-white" : ""}`}
            >
              {label}
              {activeId === id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 text-muted hover:text-white transition"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav id="mobile-menu" className="sm:hidden absolute top-full left-0 w-full bg-canvas/95 backdrop-blur-xl border-b border-line px-6 py-4 flex flex-col gap-4 text-sm text-neutral-300 shadow-2xl">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={handleNavClick}
              aria-current={activeId === id ? "location" : undefined}
              className={`hover:text-white transition py-1 ${activeId === id ? "text-white" : ""}`}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
