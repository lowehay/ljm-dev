"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import HalftoneReveal from "./HalftoneReveal/HalftoneReveal";
import { useTheme } from "./useTheme";

// The pixel/photo layers fill the space they're given (the ProfileCard photo area), which handles tilt, glare, and parallax
const LENS_RADIUS = 110;
const COLS = 12;
const ROWS = 14;
// Dissolving away ripples out slowly; coming back is quicker so the photo returns promptly
const DISSOLVE = { spread: 0.5, duration: 0.45 };
const REASSEMBLE = { spread: 0.25, duration: 0.3 };
// Resting tiles are scaled up slightly so neighbors overlap and no hairline seams show
const TILE_SCALE = 1.04;
const IMAGE_SIZES = "320px";

// The top layer (photo) shows by default. Hovering reveals the base layer (pixel art) through the lens;
// clicking dissolves the photo into a halftone print, whose dots swell back into the photo under the cursor.
const TOP_IMAGE = "/avatar-real.png";
const BASE_IMAGE = "/avatar-pixel.png";

// Halftone paper matches the card's photo backdrop in each theme
const HALFTONE = {
  dark: { inkColor: "#e5e5e5", paperColor: "#262626" },
  light: { inkColor: "#0a0a0a", paperColor: "#fafafa" },
};

// Optimized URL for the top image, used as the background of each dissolve tile
const {
  props: { src: topTileSrc },
} = getImageProps({ src: TOP_IMAGE, alt: "", width: 640, height: 640 });

const TILES = Array.from({ length: COLS * ROWS }, (_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

// Normalized waypoints the lens drifts through on touch devices: eyes, then smile
const SWEEP_PATH = [
  [0.2, 0.25],
  [0.42, 0.3],
  [0.6, 0.3],
  [0.75, 0.38],
  [0.5, 0.5],
];

export default function AvatarReveal() {
  const containerRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, amount: 0.6 });
  const theme = useTheme() ?? "dark";

  const [isRevealed, setIsRevealed] = useState(false);
  // Tiles stay mounted from the first click until they've fully reassembled
  const [tilesActive, setTilesActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });

  // Pointer position in px, which the lens follows
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Lens trails the cursor on a spring
  const lensX = useSpring(pointerX, { stiffness: 300, damping: 30, mass: 0.6 });
  const lensY = useSpring(pointerY, { stiffness: 300, damping: 30, mass: 0.6 });

  // Lens grows on enter, collapses on leave, and stretches with cursor speed
  const lensTarget = useMotionValue(0);
  const lensBase = useSpring(lensTarget, { stiffness: 220, damping: 18 });

  // Any real interaction takes over from the idle sweep
  const sweepRef = useRef<{ stop: () => void }[]>([]);
  const stopSweep = () => {
    if (!sweepRef.current.length) return;
    sweepRef.current.forEach((a) => a.stop());
    sweepRef.current = [];
    lensTarget.set(0);
  };

  const velocityX = useVelocity(pointerX);
  const velocityY = useVelocity(pointerY);
  const speedBoost = useSpring(
    useTransform([velocityX, velocityY], ([vx, vy]: number[]) =>
      Math.min(Math.hypot(vx, vy) / 40, 50)
    ),
    { stiffness: 150, damping: 25 }
  );
  const lensRadius = useTransform([lensBase, speedBoost], ([base, boost]: number[]) =>
    Math.max(0, base + boost * (base / LENS_RADIUS))
  );

  const maskImage = useMotionTemplate`radial-gradient(circle ${lensRadius}px at ${lensX}px ${lensY}px, transparent 0%, rgba(0,0,0,0.3) 75%, black 100%)`;
  // Inverse of the top mask: the base only shows through the lens, so its silhouette never peeks out around the top image
  const baseMaskImage = useMotionTemplate`radial-gradient(circle ${lensRadius}px at ${lensX}px ${lensY}px, black 0%, rgba(0,0,0,0.7) 75%, transparent 100%)`;

  const getLocalPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    stopSweep();
    if (e.pointerType === "touch") return;
    const { x, y } = getLocalPoint(e.clientX, e.clientY);
    // Start the lens under the cursor instead of springing in from elsewhere
    pointerX.jump(x);
    pointerY.jump(y);
    lensX.jump(x);
    lensY.jump(y);
    lensTarget.set(LENS_RADIUS);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch") return;
    const { x, y } = getLocalPoint(e.clientX, e.clientY);
    pointerX.set(x);
    pointerY.set(y);
  };

  const handlePointerLeave = () => {
    lensTarget.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopSweep();
    // Keyboard activation reports detail 0 and no meaningful coordinates
    if (e.detail === 0) {
      setOrigin({ x: 0.5, y: 0.5 });
    } else {
      const { x, y, width, height } = getLocalPoint(e.clientX, e.clientY);
      setOrigin({ x: x / width, y: y / height });
    }
    if (!prefersReducedMotion) setTilesActive(true);
    setIsRevealed((r) => !r);
  };

  // Warm the cache so the tiles aren't blank on the first click
  useEffect(() => {
    new window.Image().src = topTileSrc;
  }, []);

  // On touch devices, drift the lens across the face once so visitors discover the reveal
  useEffect(() => {
    if (!isInView || prefersReducedMotion || !containerRef.current) return;
    if (!window.matchMedia("(hover: none)").matches) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const xs = SWEEP_PATH.map(([x]) => x * width);
    const ys = SWEEP_PATH.map(([, y]) => y * height);
    pointerX.jump(xs[0]);
    pointerY.jump(ys[0]);
    lensX.jump(xs[0]);
    lensY.jump(ys[0]);

    const timing = { duration: 2.4, ease: "easeInOut" as const, delay: 0.4 };
    sweepRef.current = [
      animate(pointerX, xs, timing),
      animate(pointerY, ys, timing),
      animate(lensTarget, [0, 80, 80, 0], { ...timing, times: [0, 0.15, 0.85, 1] }),
    ];
    const sweep = sweepRef.current;
    return () => sweep.forEach((a) => a.stop());
  }, [isInView, prefersReducedMotion, pointerX, pointerY, lensX, lensY, lensTarget]);

  // Tiles ripple outward from the click point; the farthest one finishes last
  const tileTiming = isRevealed ? DISSOLVE : REASSEMBLE;
  const tileDelay = (col: number, row: number) =>
    Math.hypot((col + 0.5) / COLS - origin.x, (row + 0.5) / ROWS - origin.y) * tileTiming.spread;
  const maxTileDelay = Math.max(...TILES.map((t) => tileDelay(t.col, t.row)));
  // The halftone print stays mounted from the click until the photo has fully reassembled over it
  const showHalftone = isRevealed || tilesActive;

  return (
    <button
      ref={containerRef}
      type="button"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-pressed={isRevealed}
      aria-label="Toggle between photo and halftone print"
      className="block w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative w-full h-full">
        {/* Base Layer: Pixel Avatar, shown only through the lens and hidden in halftone mode */}
        <motion.div
          style={{ WebkitMaskImage: baseMaskImage, maskImage: baseMaskImage }}
          // The image layers ignore the pointer so the halftone beneath can track the cursor
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{ opacity: showHalftone ? 0 : 1 }}
          transition={{ duration: 0 }}
        >
          <Image
            src={BASE_IMAGE}
            alt=""
            fill
            sizes={IMAGE_SIZES}
            className="object-cover object-bottom"
            priority
          />
        </motion.div>

        {/* Halftone Layer: revealed by the click dissolve; hovering swells the dots back into the photo */}
        {showHalftone && (
          <div className="absolute inset-0">
            <HalftoneReveal
              src={TOP_IMAGE}
              fit="cover"
              mode="mono"
              shape="dot"
              cellSize={5}
              angle={45}
              {...HALFTONE[theme]}
              revealRadius={70}
              softness={0.6}
              linger={1.2}
              // A burst would fire on the same click that switches modes, so it's off
              clickBurst={false}
              intro
            />
          </div>
        )}

        {/* Top Layer: Real Photo, masked out by the spotlight lens */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ WebkitMaskImage: maskImage, maskImage }}
          initial={false}
          animate={{ opacity: tilesActive || isRevealed ? 0 : 1 }}
          // With motion on, the tiles handle the transition, so the layer just swaps
          transition={{ duration: prefersReducedMotion ? 0.3 : 0 }}
        >
          <Image
            src={TOP_IMAGE}
            alt="Louie Jae Maravillosa"
            fill
            sizes={IMAGE_SIZES}
            className="object-cover object-bottom"
            priority
          />
        </motion.div>

        {/* Dissolve Layer: the top image split into tiles that pop out (and back) from the click point */}
        {tilesActive && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {TILES.map(({ col, row }, i) => {
              const delay = tileDelay(col, row);
              return (
                <motion.div
                  key={i}
                  className="absolute overflow-hidden"
                  style={{
                    left: `${(col * 100) / COLS}%`,
                    top: `${(row * 100) / ROWS}%`,
                    width: `${100 / COLS}%`,
                    height: `${100 / ROWS}%`,
                  }}
                  initial={{ opacity: 1, scale: TILE_SCALE }}
                  animate={
                    isRevealed
                      ? { opacity: [1, 1, 0], scale: [TILE_SCALE, 1.25, 0] }
                      : { opacity: [0, 1, 1], scale: [0, 1.15, TILE_SCALE] }
                  }
                  transition={{ duration: tileTiming.duration, delay, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (!isRevealed && delay === maxTileDelay) setTilesActive(false);
                  }}
                >
                  <div
                    className="absolute bg-no-repeat bg-bottom bg-cover"
                    style={{
                      backgroundImage: `url(${topTileSrc})`,
                      left: `${-col * 100}%`,
                      top: `${-row * 100}%`,
                      width: `${COLS * 100}%`,
                      height: `${ROWS * 100}%`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </button>
  );
}
