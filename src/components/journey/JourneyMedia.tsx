"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { JourneyMedia as Media } from "./journey-data";

export default function JourneyMedia({ media, still = false, priority = false }: {
  media: Media;
  still?: boolean;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const userRequestedPlay = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const start = () => {
      if (!video.getAttribute("src")) video.src = media.src;
      void video.play().catch(() => { /* Poster + play button remain usable. */ });
    };
    const sync = () => {
      if (visible && (!reduced.matches || userRequestedPlay.current) && !userPaused.current && !document.hidden) start();
      else video.pause();
    };
    const preferenceChanged = () => {
      userRequestedPlay.current = false;
      sync();
    };
    // Only one clip plays at a time, including adjacent timeline chapters.
    const onPlay = () => {
      document.querySelectorAll<HTMLVideoElement>("video[data-journey-video]").forEach((other) => {
        if (other !== video) other.pause();
      });
    };
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        }, { threshold: 0.35 })
      : null;
    observer?.observe(video);
    reduced.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", sync);
    video.addEventListener("play", onPlay);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("play", onPlay);
      video.pause();
    };
  }, [media.src]);

  return (
    <div className={`journey-media${still ? " journey-media--still" : ""}`}>
      {still ? (
        <Image src={media.poster} alt={media.alt} width={media.width} height={media.height}
          sizes="(max-width: 760px) 85vw, 700px" priority={priority} />
      ) : (
        <>
          <video ref={videoRef} data-journey-video muted loop playsInline preload="none"
            poster={media.poster} width={media.width} height={media.height} aria-label={media.alt}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
            {media.alt}
          </video>
          <button type="button" className="journey-media__control"
            aria-label={`${playing ? "Pause" : "Play"} clip: ${media.alt}`}
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              if (!video.paused) {
                userPaused.current = true;
                video.pause();
              } else {
                userPaused.current = false;
                userRequestedPlay.current = true;
                if (!video.getAttribute("src")) video.src = media.src;
                void video.play().catch(() => {});
              }
            }}>
            <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span> {playing ? "Pause clip" : "Play clip"}
          </button>
        </>
      )}
    </div>
  );
}
