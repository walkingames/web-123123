import { ImageResponse } from "next/og";

export const alt = "WalkinGames — Indie Game Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
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
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            WalkinGames
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            Indie Game Studio
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
