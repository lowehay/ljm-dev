import { ImageResponse } from "next/og";
import { site } from "./site";

// Shared look for the social preview images (Messenger, LinkedIn, X...) of case studies and notes:
// the site's dark canvas, a small label, the page title, and a one-line summary.
export const ogSize = { width: 1200, height: 630 };

export function ogCard({ eyebrow, title, subtitle, tags = [] }: { eyebrow: string; title: string; subtitle: string; tags?: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 85% 0%, #1f1f1f 0%, #0a0a0a 55%)",
          color: "#ededed",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#a3a3a3", letterSpacing: 3, textTransform: "uppercase" }}>
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 40 ? 60 : 72, fontWeight: 700, color: "#ffffff", lineHeight: 1.08 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#a3a3a3", marginTop: 24, lineHeight: 1.4, maxWidth: 960 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{ display: "flex", padding: "8px 18px", borderRadius: 999, border: "2px solid #262626", color: "#d4d4d4" }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: "#d4d4d4" }}>{site.name}</div>
        </div>
      </div>
    ),
    ogSize
  );
}
