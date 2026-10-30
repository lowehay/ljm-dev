"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

// Pulls its child toward the mouse while the cursor is near, then springs back.
// The padding (cancelled by a matching negative margin) widens the area that attracts the cursor.
export default function Magnet({
  children,
  strength = 0.3,
  max = 10,
}: {
  children: React.ReactNode;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const spring = { stiffness: 250, damping: 18 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clampToMax = (v: number) => Math.max(-max, Math.min(max, v));
    x.set(clampToMax((e.clientX - (rect.left + rect.width / 2)) * strength));
    y.set(clampToMax((e.clientY - (rect.top + rect.height / 2)) * strength));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className="inline-flex p-3 -m-3"
    >
      {children}
    </motion.span>
  );
}
