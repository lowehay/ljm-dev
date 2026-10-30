"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

// Scrambles through random glyphs and resolves left to right the first time it scrolls into view.
// The real text renders on the server and for reduced-motion visitors, and screen readers always get it.
export default function DecryptedText({ text, speed = 30 }: { text: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let tick = 0;
        timer = window.setInterval(() => {
          tick += 1;
          // Each character scrambles for two ticks before it locks in
          const revealed = Math.floor(tick / 2);
          if (revealed >= text.length) {
            window.clearInterval(timer);
            setDisplay(text);
            return;
          }
          setDisplay(
            Array.from(text, (char, i) =>
              i < revealed || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            ).join("")
          );
        }, speed);
      },
      { threshold: 0.6 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
