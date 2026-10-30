// Progressive blur fixed to the top of the screen, so content scrolling under the transparent navbar
// softens away instead of colliding with it. Stronger blur layers cover a shorter band near the top edge.
const LAYERS = [0.5, 1, 2, 4, 8];

export default function GradualBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 print:hidden"
      style={{
        background:
          "linear-gradient(to bottom, color-mix(in srgb, var(--color-canvas) 65%, transparent), transparent)",
      }}
    >
      {LAYERS.map((blur, i) => {
        const end = 100 - i * 18;
        const start = Math.max(0, end - 45);
        const mask = `linear-gradient(to bottom, black ${start}%, transparent ${end}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
