"use client";

import StarBorder from "./StarBorder/StarBorder";
import { useTheme } from "./useTheme";

// The contact email as a framed link with a star of light circling its border
export default function EmailLink({ email }: { email: string }) {
  const theme = useTheme() ?? "dark";
  const light = theme === "light";

  return (
    <StarBorder
      as="a"
      href={`mailto:${email}`}
      theme={theme}
      // The star is drawn on a canvas, which needs real colors rather than CSS variables
      color={light ? "#0a0a0a" : "#ffffff"}
      backgroundColor="var(--color-surface)"
      textColor="var(--color-fg)"
      borderColor="var(--color-line)"
      duration={4}
      direction="clockwise"
      stars={1}
      trailLength={0.3}
      thickness={1}
      radius={12}
      glow={0.6}
      hover="lap"
      sparkle={false}
      clickPulse
      className="max-w-full px-4 sm:px-6 text-[15px] sm:text-xl font-semibold tracking-tight break-all"
    >
      {email}
    </StarBorder>
  );
}
