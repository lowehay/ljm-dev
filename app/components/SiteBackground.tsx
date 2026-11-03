"use client";

import PixelBackground from "./PixelBackground";
import GrainBackground from "./GrainBackground";
import { useBackground } from "./useBackground";
import { useHardwareWebGL } from "./useHardwareWebGL";

// Renders whichever animated background the visitor picked with the navbar switch.
// Devices drawing WebGL without a GPU get a static dot grid instead, since the animation would freeze them.
export default function SiteBackground() {
  const background = useBackground();
  const hardwareWebGL = useHardwareWebGL();
  if (!background || hardwareWebGL === null) return null;

  if (!hardwareWebGL) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none print:hidden"
        style={{
          backgroundImage: "radial-gradient(color-mix(in srgb, var(--color-fg) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
          maskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
        }}
      />
    );
  }

  return background === "grain" ? <GrainBackground /> : <PixelBackground />;
}
