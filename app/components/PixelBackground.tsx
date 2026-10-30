"use client";

import PixelBlast from "./PixelBlast/PixelBlast";
import { useTheme } from "./useTheme";

// Monochrome pixel field fixed behind the whole site; it reads the pointer from window, so it never blocks clicks
export default function PixelBackground() {
  const theme = useTheme();
  // Theme is unknown until the first client render; wait so the colors don't flash
  if (!theme) return null;
  const light = theme === "light";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
      <PixelBlast
        variant="square"
        pixelSize={3}
        color={light ? "#c4c4c4" : "#3a3a3a"}
        accentColor={light ? "#8a8a8a" : "#6b6b6b"}
        lightMode={light}
        patternScale={2}
        patternDensity={1}
        softness={0.6}
        glow={0.2}
        twinkle={0.2}
        speed={0.4}
        drift={0.15}
        hoverEffect="reveal"
        hoverRadius={120}
        enableRipples
        rippleIntensityScale={0.8}
        edgeFade={0.15}
      />
    </div>
  );
}
