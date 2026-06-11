import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "WalkinGames — Indie Game Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const buf = readFileSync(join(process.cwd(), "public", "WalkinGames.com.png"));
  const src = `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
        }}
      >
        <img src={src} width={400} height={400} style={{ objectFit: "contain" }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
