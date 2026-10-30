"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

// Counts from 0 up to `to` the first time it scrolls into view. The final number renders on the server,
// and updates are written straight to the DOM so counting doesn't re-render React.
export default function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let controls: { stop: () => void } | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        controls = animate(0, to, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (value) => {
            element.textContent = String(Math.round(value));
          },
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [to, duration]);

  return <span ref={ref}>{to}</span>;
}
