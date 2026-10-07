import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, journeyOgImageAlt } from "@/lib/site";

export const alt = journeyOgImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function JourneyOpenGraphImage() {
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
          background: `radial-gradient(circle at 50% 50%, ${brand.accent}30 0%, transparent 50%), ${brand.background}`,
        }}
      >
        <img
          src={src}
          alt=""
          width={500}
          height={500}
          style={{ width: 500, height: 500, borderRadius: 100, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        />
      </div>
    ),
    { ...size },
  );
}
