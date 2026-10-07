import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, ogImageAlt, siteTagline } from "@/lib/site";

export const alt = ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const [font, bg] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/SCHABO-Condensed.otf")),
    readFile(join(process.cwd(), "src/assets/og-icon.png"), "base64"),
  ]);
  const src = `data:image/png;base64,${bg}`;
  const { background, accent, foreground } = brand;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: "48px 62px",
          overflow: "hidden",
          backgroundColor: background,
          color: foreground,
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", background: `radial-gradient(circle at 80% 50%, ${accent}30 0%, transparent 52%)` }} />
        <img
          src={src}
          alt=""
          width={420}
          height={420}
          style={{ position: "absolute", right: 90, top: 92, width: 420, height: 420, borderRadius: 86, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        />
        <div style={{ position: "relative", display: "flex", alignItems: "center", fontSize: 28, letterSpacing: "0.03em" }}>
          <span style={{ fontSize: 64 }}>WalkinGames</span>
        </div>
        <div style={{ position: "absolute", left: 690, top: 68, width: 420, display: "flex", justifyContent: "center", color: accent, fontSize: 22, letterSpacing: "0.14em", paddingLeft: "0.14em" }}>
          INDEPENDENT GAME STUDIO
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 760 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 22, color: accent }}>
            Mobile &amp; PC
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 118, lineHeight: 0.82, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase", fontFamily: "Schabo" }}>
            <span>Games built</span>
            <span>to keep</span>
            <span style={{ color: accent }}>moving.</span>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${foreground}66`, paddingTop: 18, fontSize: 26, letterSpacing: "0.02em" }}>
          <span>{siteTagline}</span>
          <span style={{ color: accent, fontSize: 32 }}>↗</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Schabo", data: font, weight: 400, style: "normal" }] },
  );
}
