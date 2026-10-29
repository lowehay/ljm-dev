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

const LENS_RADIUS = 110;
const TILT_DEG = 8;
const PARALLAX_PX = 6;
const COLS = 12;
const ROWS = 14;
const IMAGE_SIZES = "(max-width: 640px) 224px, 256px";

// Optimized URL for the pixel avatar, used as the background of each dissolve tile
const {
  props: { src: pixelTileSrc },
} = getImageProps({ src: "/avatar-pixel.png", alt: "", width: 320, height: 320 });

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

  const [isRevealed, setIsRevealed] = useState(false);
  // Tiles stay mounted from the first click until they've fully reassembled
  const [tilesActive, setTilesActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });

  // Pointer position in px (for the lens) and normalized 0..1 (for tilt/parallax)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

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
  const sheen = useMotionTemplate`radial-gradient(circle 160px at ${lensX}px ${lensY}px, rgba(255,255,255,0.09), transparent 70%)`;
  const sheenOpacity = useTransform(lensBase, [0, LENS_RADIUS], [0, 1]);

  // 3D tilt toward the cursor, with the photo layer drifting for depth
  const tiltSpring = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(normY, [0, 1], [TILT_DEG, -TILT_DEG]), tiltSpring);
  const rotateY = useSpring(useTransform(normX, [0, 1], [-TILT_DEG, TILT_DEG]), tiltSpring);
  const photoX = useSpring(useTransform(normX, [0, 1], [PARALLAX_PX, -PARALLAX_PX]), tiltSpring);
  const photoY = useSpring(useTransform(normY, [0, 1], [PARALLAX_PX, -PARALLAX_PX]), tiltSpring);

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
    const { x, y, width, height } = getLocalPoint(e.clientX, e.clientY);
    pointerX.set(x);
    pointerY.set(y);
    if (!prefersReducedMotion) {
      normX.set(x / width);
      normY.set(y / height);
    }
  };

  const handlePointerLeave = () => {
    lensTarget.set(0);
    normX.set(0.5);
    normY.set(0.5);
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
    new window.Image().src = pixelTileSrc;
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
  const tileDelay = (col: number, row: number) =>
    Math.hypot((col + 0.5) / COLS - origin.x, (row + 0.5) / ROWS - origin.y) * 0.5;
  const maxTileDelay = Math.max(...TILES.map((t) => tileDelay(t.col, t.row)));

  return (
    <button
      ref={containerRef}
      type="button"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-pressed={isRevealed}
      aria-label="Toggle between pixel avatar and real photo"
      className="block w-full h-64 sm:h-72 rounded-2xl cursor-pointer [perspective:900px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full h-full overflow-hidden rounded-2xl bg-surface/60 border border-line"
      >
        {/* Base Layer: Real Photo, drifting slightly opposite the cursor for depth */}
        <motion.div style={{ x: photoX, y: photoY }} className="absolute inset-0">
          <Image
            src="/avatar-real.png"
            alt="Louie Jae Maravillosa"
            fill
            sizes={IMAGE_SIZES}
            className="object-contain object-center"
            priority
          />
        </motion.div>

        {/* Top Layer: Pixel Avatar, masked out by the spotlight lens */}
        <motion.div
          className="absolute inset-0"
          style={{ WebkitMaskImage: maskImage, maskImage }}
          initial={false}
          animate={{ opacity: tilesActive || isRevealed ? 0 : 1 }}
          // With motion on, the tiles handle the transition, so the layer just swaps
          transition={{ duration: prefersReducedMotion ? 0.3 : 0 }}
        >
          <Image
            src="/avatar-pixel.png"
            alt=""
            fill
            sizes={IMAGE_SIZES}
            className="object-contain object-center"
            priority
          />
        </motion.div>

        {/* Dissolve Layer: the pixel avatar split into tiles that pop out (and back) from the click point */}
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
                  initial={{ opacity: 1, scale: 1 }}
                  animate={
                    isRevealed
                      ? { opacity: [1, 1, 0], scale: [1, 1.25, 0] }
                      : { opacity: [0, 1, 1], scale: [0, 1.25, 1] }
                  }
                  transition={{ duration: 0.45, delay, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (!isRevealed && delay === maxTileDelay) setTilesActive(false);
                  }}
                >
                  <div
                    className="absolute bg-no-repeat bg-center bg-contain"
                    style={{
                      backgroundImage: `url(${pixelTileSrc})`,
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

        {/* Sheen: soft light following the lens */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ backgroundImage: sheen, opacity: sheenOpacity }}
        />
      </motion.div>
    </button>
  );
}
