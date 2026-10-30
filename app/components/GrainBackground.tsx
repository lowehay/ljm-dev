"use client";

import Grainient from "./Grainient/Grainient";
import { useTheme } from "./useTheme";

// Grayscale ramps that start at the page's canvas color so the edges blend into the site
const DARK = ["#0a0a0a", "#0f0f0f", "#171717", "#202020", "#2b2b2b"];
const LIGHT = ["#fafafa", "#f3f3f3", "#e9e9e9", "#dedede", "#d2d2d2"];

// Monochrome, grainy gradient fixed behind the whole site; it reads the pointer from window, so it never blocks clicks
export default function GrainBackground() {
  const theme = useTheme();
  // Theme is unknown until the first client render; wait so the colors don't flash
  if (!theme) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
      <Grainient
        colors={theme === "light" ? LIGHT : DARK}
        angle={55}
        flow={0.8}
        silk={0.35}
        softness={0.65}
        grainAmount={0.08}
        speed={2}
        saturation={0}
      />
    </div>
  );
}
