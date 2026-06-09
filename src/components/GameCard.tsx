"use client";

import Image from "next/image";

interface GameCardProps {
  src: string;
  name: string;
}

export default function GameCard({ src, name }: GameCardProps) {
  return (
    <button
      type="button"
      className="group relative w-[180px] h-[300px] rounded-lg overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
      onClick={() => {}}
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative w-full h-full rounded-[7px] overflow-hidden bg-black/20">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="180px"
        />
      </div>

      {/* Animated gradient border overlay (orbits around) */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none animate-border-orbit"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 42%, #ffffff 50%, rgba(255,255,255,0.15) 58%, transparent 70%)",
          backgroundSize: "400% 400%",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center
                      bg-black/60 backdrop-blur-sm
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 ease-out
                      m-[1px] rounded-[7px] pointer-events-none">
        <span className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase select-none">
          {name}
        </span>
      </div>
    </button>
  );
}
