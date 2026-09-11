import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "WalkinGames | Indie Game Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const buf = readFileSync(join(process.cwd(), "public", "images", "walkin-about-hero.png"));
  const src = `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "54px 64px",
          overflow: "hidden",
          backgroundColor: "#e9e9e1",
          color: "#000000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, fontWeight: 700, letterSpacing: "-0.05em" }}>
          <span style={{ color: "#ecff00", marginRight: 12 }}>W/</span>
          WalkinGames
        </div>
        <img
          src={src}
          alt=""
          width={760}
          height={428}
          style={{ position: "absolute", right: 0, top: 0, width: 760, height: 630, objectFit: "cover", objectPosition: "65% center", opacity: 0.82 }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, #e9e9e1 0%, #e9e9e1e8 32%, #e9e9e100 72%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 720 }}>
          <div style={{ display: "flex", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 22 }}>
            Independent game studio · Mobile &amp; PC
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.84, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", fontFamily: "Arial Narrow, Arial, sans-serif" }}>
            <span>Let&apos;s make the</span>
            <span style={{ color: "#000000", background: "#ecff00", padding: "7px 14px 0", width: "auto", transform: "rotate(-3deg)" }}>next world.</span>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Focused, replayable games with atmosphere and a pulse.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
