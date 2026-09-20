import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "Walkin — From the first build to today. March–September 2026.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function JourneyOpenGraphImage() {
  const font = readFileSync(join(process.cwd(), "src/fonts/SCHABO-Condensed.otf"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "50px 64px", background: "#090d12", color: "#f4f4ed" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}><span>WalkinGames / Development journal</span><span style={{ color: "#ecff00" }}>MAR — SEP 2026</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontFamily: "Schabo", fontSize: 150, lineHeight: 0.94 }}><span>FROM THE FIRST BUILD</span><span style={{ color: "#ecff00" }}>TO WALKIN.</span></div>
      <div style={{ display: "flex", borderTop: "1px solid #ffffff40", paddingTop: 24, fontSize: 20 }}>One world. Built system by system. Run by run.</div>
    </div>,
    { ...size, fonts: [{ name: "Schabo", data: font, weight: 400, style: "normal" }] },
  );
}
