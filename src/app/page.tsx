"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import GameCard from "@/components/GameCard";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}

export default function Home() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative w-dvw h-dvh overflow-hidden">
      {/* Animated background */}
      {!reducedMotion && (
        <Dither
          waveColor={[0.38, 0.38, 0.38]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0}
          colorNum={25.3}
          waveAmplitude={0.35}
          waveFrequency={4}
          waveSpeed={0.04}
        />
      )}

      {/* Static fallback for reduced motion */}
      {reducedMotion && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center
                      px-4 sm:px-8 md:px-12
                      pointer-events-none
                      animate-fade-in">

        {/* Logo */}
        <div className="pointer-events-auto mb-8 sm:mb-12 md:mb-16 lg:mb-20
                        transition-all duration-700 ease-out
                        animate-scale-in">
          <Image
            src="/WalkinGames.com.png"
            alt="WalkinGames"
            width={500}
            height={250}
            priority
            className="h-auto w-auto
                       max-w-[75vw] sm:max-w-[60vw] md:max-w-[50vw] lg:max-w-[500px]
                       max-h-[30vh] sm:max-h-[35vh] md:max-h-[40vh]
                       object-contain
                       drop-shadow-[0_0_30px_rgba(255,255,255,0.03)]"
          />
        </div>

        {/* Game cards */}
        <div className="flex flex-col sm:flex-row items-center gap-[50px] sm:gap-24 lg:gap-[100px]
                        pointer-events-auto
                        animate-fade-in"
             style={{ animationDelay: "0.2s" }}>
          <GameCard src="/images/PostYazisiz.png" name="Walkin" fit="cover-top" />
          <GameCard src="/images/DuskfallRequiem.png" name="DuskfallRequiem" />
        </div>

        {/* Footer hint */}
        <p className="absolute bottom-6 sm:bottom-8 md:bottom-10
                     text-white/15 text-[10px] sm:text-xs tracking-[0.2em] uppercase
                     pointer-events-auto select-none
                     animate-fade-in"
           style={{ animationDelay: "0.4s" }}>
          WalkinGames &mdash; Est. 2025
        </p>
      </div>
    </div>
  );
}