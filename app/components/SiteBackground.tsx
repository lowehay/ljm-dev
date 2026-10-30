"use client";

import PixelBackground from "./PixelBackground";
import GrainBackground from "./GrainBackground";
import { useBackground } from "./useBackground";

// Renders whichever animated background the visitor picked with the navbar switch
export default function SiteBackground() {
  const background = useBackground();
  if (!background) return null;
  return background === "grain" ? <GrainBackground /> : <PixelBackground />;
}
