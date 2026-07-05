"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import ContactSection from "@/components/ContactSection";
import StickerPeel from "@/components/StickerPeel";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Navbar />

      <main id="main" role="main" className="relative">
        <div className="fixed inset-0 z-0" aria-hidden="true">
          {!reducedMotion ? (
            <Dither
              waveColor={isDark ? [0.38, 0.38, 0.38] : [0.7, 0.7, 0.7]}
              disableAnimation={false}
              enableMouseInteraction={false}
              mouseRadius={0}
              colorNum={isDark ? 25.3 : 16}
              waveAmplitude={0.35}
              waveFrequency={4}
              waveSpeed={0.04}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
          )}
        </div>

        <div className="fixed inset-0 z-[1] bg-background/40 dark:bg-background/30 backdrop-blur-2xl" aria-hidden="true" />

        <div className="relative z-10">
          <Hero />
          <ProjectShowcase />
          <ContactSection />
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="relative w-full h-full" style={{ minHeight: "200vh" }}>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-w.svg" width={70} rotate={-12} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.3} lightingIntensity={0.06} initialPosition={{ x: 200, y: 400 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-a.svg" width={70} rotate={8} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.25} lightingIntensity={0.05} initialPosition={{ x: 100, y: 250 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-l.svg" width={70} rotate={-5} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.35} lightingIntensity={0.07} initialPosition={{ x: 300, y: 180 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-k.svg" width={70} rotate={15} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.3} lightingIntensity={0.06} initialPosition={{ x: 80, y: 520 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-i.svg" width={60} rotate={-18} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.25} lightingIntensity={0.05} initialPosition={{ x: 350, y: 460 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
            <div className="pointer-events-auto">
              <StickerPeel imageSrc="/images/sticker-n.svg" width={70} rotate={3} peelBackHoverPct={20} peelBackActivePct={35} shadowIntensity={0.3} lightingIntensity={0.06} initialPosition={{ x: 250, y: 620 }} peelDirection={0} bounds={{ top: 80, left: 0 }} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
