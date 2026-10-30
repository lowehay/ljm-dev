"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Grid3x3, Waves } from "lucide-react";
import { setBackground, useBackground } from "./useBackground";

// Switches the site background between the pixel field and the grainy gradient
export default function BackgroundToggle() {
  const background = useBackground();
  const next = background === "grain" ? "pixel" : "grain";
  const label = next === "grain" ? "Switch to gradient background" : "Switch to pixel background";

  return (
    <button
      type="button"
      onClick={() => setBackground(next)}
      aria-label={label}
      title={label}
      className="p-2 text-muted hover:text-fg transition"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={background ?? "pending"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="block"
        >
          {/* Icon shows the background that's currently on */}
          {background === "grain" ? <Waves className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
