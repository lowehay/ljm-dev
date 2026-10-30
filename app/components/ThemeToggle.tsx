"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { getTheme, useTheme, type Theme } from "./useTheme";

export default function ThemeToggle() {
  const theme = useTheme();

  const toggle = () => {
    const next: Theme = getTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="p-2 text-muted hover:text-fg transition"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "pending"}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="block"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
