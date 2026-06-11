import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "WalkinGames — Indie Game Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const logoPath = join(process.cwd(), "public", "WalkinGames.com.png");
  const logoData = readFileSync(logoPath);
  const logoBase64 = logoData.toString("base64");
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient glow */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo */}
        <img
          src={logoDataUri}
          alt="WalkinGames"
          style={{
            width: 400,
            height: 400,
            objectFit: "contain",
            position: "relative",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
