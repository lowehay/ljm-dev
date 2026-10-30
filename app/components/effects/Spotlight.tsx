"use client";

import { useRef } from "react";

// A soft light that follows the cursor across the element on hover (touch screens never show it).
export default function Spotlight({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    element.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={handlePointerMove} className={`group/spot relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-fg) 7%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
