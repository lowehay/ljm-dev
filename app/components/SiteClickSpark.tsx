"use client";

import ClickSpark from "./ClickSpark/ClickSpark";
import { useTheme } from "./useTheme";

// Small monochrome sparks wherever someone clicks. Each burst draws on its own tiny canvas
// that's removed when it ends, so nothing runs between clicks.
export default function SiteClickSpark({ children }: { children: React.ReactNode }) {
  const theme = useTheme() ?? "dark";
  return (
    <ClickSpark
      // The sparks are drawn on a canvas, which needs real colors rather than CSS variables
      sparkColor={theme === "light" ? "#0a0a0a" : "#fafafa"}
      sparkSize={8}
      sparkRadius={18}
      sparkCount={8}
      sparkWidth={1.5}
      duration={400}
      className="flex flex-1 flex-col"
      style={{ height: "auto" }}
    >
      {children}
    </ClickSpark>
  );
}
