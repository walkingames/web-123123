"use client";

import Image from "next/image";
import Dither from "@/components/Dither";
import GameCard from "@/components/GameCard";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
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

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-16 pointer-events-none">
        <Image
          src="/WalkinGames.com.png"
          alt="WalkinGames"
          width={500}
          height={250}
          priority
          className="h-auto w-auto max-w-[80vw] max-h-[40vh] object-contain"
        />

        <div className="flex gap-28 pointer-events-auto">
          <GameCard src="/images/Walkin.png" name="Walkin" />
          <GameCard src="/images/DuskfallRequiem.png" name="DuskfallRequiem" />
        </div>
      </div>
    </div>
  );
}