"use client";

import { useCallback } from "react";
import Image from "next/image";

interface GameCardProps {
  src: string;
  name: string;
  fit?: "cover-top" | "cover-center";
}

export default function GameCard({ src, name, fit = "cover-center" }: GameCardProps) {
  const handleClick = useCallback(() => {
    // Future: navigate to game details page
  }, []);

  return (
    <button
      type="button"
      className="group relative w-[150px] sm:w-[180px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden
                 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.97]"
      onClick={handleClick}
      tabIndex={0}
      aria-label={`View ${name} game details`}
    >
      {/* Card inner */}
      <div className="relative w-full h-full rounded-[9px] overflow-hidden bg-black/30
                      shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]
                      group-hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.12)]
                      transition-shadow duration-500">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition-all duration-700 ease-out
                     group-hover:scale-105 group-hover:brightness-110"
          style={{ objectPosition: fit === "cover-top" ? "center top" : "center center" }}
          sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 220px"
          loading="lazy"
        />
      </div>

      {/* Animated gradient border (orbits, GPU-friendly) */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none animate-border-orbit
                    will-change-[background-position]"
        style={{
          padding: "1.5px",
          background:
            "linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.08) 37%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.08) 63%, transparent 75%)",
          backgroundSize: "400% 400%",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Hover shine effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-500 pointer-events-none
                      bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Hover overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-5
                      opacity-0 group-hover:opacity-100
                      transition-all duration-400 ease-out
                      m-[1.5px] rounded-[9px] pointer-events-none
                      bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <span className="text-white/90 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase select-none
                        translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {name}
        </span>
        <span className="text-white/40 text-[10px] tracking-[0.15em] uppercase mt-1.5
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          View Game
        </span>
      </div>
    </button>
  );
}
