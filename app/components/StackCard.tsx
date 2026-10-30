"use client";

import { Braces, Sparkles } from "lucide-react";
import BorderGlow from "./BorderGlow/BorderGlow";
import { STACK_ICONS } from "./stackIcons";
import { useTheme } from "./useTheme";

// Generic icons for skills that aren't a product with a logo
const FALLBACK_ICONS: Record<string, typeof Sparkles> = {
  "LLM APIs": Braces,
  "Prompt Engineering": Sparkles,
};

// One technology as a compact chip: logo and name, only as wide as its content,
// with a monochrome edge glow that follows the cursor
export default function StackCard({ name }: { name: string }) {
  const light = (useTheme() ?? "dark") === "light";
  const logo = STACK_ICONS[name];
  const Fallback = FALLBACK_ICONS[name] ?? Sparkles;

  return (
    <BorderGlow
      // BorderGlow checks the background's brightness to pick its light or dark styling, so it needs a hex color
      backgroundColor={light ? "#f0f0f0" : "#141414"}
      glowColor={light ? "0 0 10" : "0 0 100"}
      colors={light ? ["#0a0a0a", "#525252", "#a3a3a3"] : ["#ffffff", "#a3a3a3", "#737373"]}
      borderRadius={10}
      glowRadius={16}
      edgeSensitivity={30}
      coneSpread={25}
      glowIntensity={1}
      fillOpacity={0.35}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        {logo ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-fg" fill="currentColor" aria-hidden="true">
            <path d={logo.path} />
          </svg>
        ) : (
          <Fallback className="w-4 h-4 shrink-0 text-fg" aria-hidden="true" />
        )}
        <span className="text-sm text-fg-soft leading-tight whitespace-nowrap">{name}</span>
      </div>
    </BorderGlow>
  );
}
