import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, waitlistOgImageAlt } from "@/lib/site";

export const alt = waitlistOgImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function WaitlistOpenGraphImage() {
  const icon = await readFile(join(process.cwd(), "src/assets/og-icon.png"), "base64");
  const src = `data:image/png;base64,${icon}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 70,
          background: `radial-gradient(circle at 50% 50%, ${brand.accent}30 0%, transparent 50%), ${brand.background}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: brand.accent,
            }}
          >
            Walkin / Waitlist
          </div>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1, fontWeight: 700 }}>
            JOIN THE LIST
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#adb8c5" }}>
            walkingames.com/waitlist
          </div>
        </div>
        <img
          src={src}
          alt=""
          width={300}
          height={300}
          style={{ width: 300, height: 300, borderRadius: 60, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        />
      </div>
    ),
    { ...size },
  );
}