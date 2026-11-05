"use client";

import { AnimatePresence, motion } from "framer-motion";
import WarmTooltip from "./WarmTooltip/WarmTooltip";
import { Moon, Sun } from "lucide-react";
import { toggleTheme, useTheme } from "./useTheme";

export default function ThemeToggle() {
  const theme = useTheme();
  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <WarmTooltip content={label} shortcut="T" side="bottom" surfaceColor="var(--color-fg)" inkColor="var(--color-canvas)" size="sm">
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
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
    </WarmTooltip>
  );
}
