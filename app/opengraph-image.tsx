import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

export const alt = `${site.name} — Full-Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const avatarData = await readFile(join(process.cwd(), "public/avatar-pixel.png"), "base64");
const avatarSrc = `data:image/png;base64,${avatarData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#ededed",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 380,
            height: 420,
            borderRadius: 32,
            border: "2px solid #262626",
            background: "#171717",
            overflow: "hidden",
          }}
        >
          <img src={avatarSrc} alt="" width={380} height={380} style={{ marginTop: 40 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 26, color: "#a3a3a3", letterSpacing: 2 }}>
            LJM.DEV
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", marginTop: 16, lineHeight: 1.1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 34, color: "#d4d4d4", marginTop: 20 }}>
            Full-Stack Developer
          </div>
          <div style={{ fontSize: 26, color: "#a3a3a3", marginTop: 28, lineHeight: 1.4 }}>
            Django · React · Next.js
          </div>
        </div>
      </div>
    ),
    size
  );
}
