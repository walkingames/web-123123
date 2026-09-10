"use client";

import { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Reveal from "./motion/Reveal";

const Dither = dynamic(() => import("./Dither"), { ssr: false });

const PHASES = [
  {
    index: "01",
    label: "Now",
    title: "Build the foundation",
    description:
      "Make the core experience undeniable before scaling the world around it.",
    items: [
      "Walkin: core gameplay, combat, and progression",
      "Duskfall Requiem: world and systems exploration",
      "A focused, repeatable production foundation",
    ],
  },
  {
    index: "02",
    label: "Next",
    title: "Prove it with players",
    description:
      "Turn promising systems into a cohesive game through testing and iteration.",
    items: [
      "Structured playtests and focused iteration",
      "Performance and platform readiness",
      "Clear, consistent development updates",
    ],
  },
  {
    index: "03",
    label: "Beyond",
    title: "Grow with intention",
    description:
      "Ship, support, and use every lesson to make the next world stronger.",
    items: [
      "Bring our first release to players",
      "Support and evolve the games we ship",
      "Build the next distinct WalkinGames world",
    ],
  },
] as const;

export default function StudioDirection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="direction"
      className="direction"
      aria-labelledby="direction-heading"
    >
      {inView && !reduce && (
        <div className="direction__ambient" aria-hidden="true">
          <Dither
            waveSpeed={0.03}
            waveFrequency={2}
            waveAmplitude={0.15}
            waveColor={[0.12, 0.22, 0.38]}
            colorNum={3}
            pixelSize={3}
            disableAnimation={false}
            enableMouseInteraction={false}
            mouseRadius={0}
          />
        </div>
      )}

      <div className="shell">
        <Reveal>
          <div className="direction__header">
            <p className="section-kicker">Studio direction / No empty promises</p>
            <h2 id="direction-heading">
              The path ahead is<br /><span>part of the story.</span>
            </h2>
            <p>
              We believe progress is more useful than hype. This is the direction
              guiding what we build now, what we validate next, and how we grow
              after release.
            </p>
          </div>
        </Reveal>

        <ol className="roadmap">
          {PHASES.map((phase, phaseIndex) => (
            <Reveal key={phase.index} delay={phaseIndex * 0.1}>
              <li className="roadmap__phase">
                <div className="roadmap__rail" aria-hidden="true">
                  <span>{phase.index}</span>
                  <i className={phaseIndex === 0 ? "is-live" : ""} />
                </div>
                <div className="roadmap__content">
                  <p className="roadmap__label">{phase.label}</p>
                  <h3>{phase.title}</h3>
                  <p className="roadmap__description">{phase.description}</p>
                  <ul>
                    {phase.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.35}>
          <div className="manifesto" aria-label="Studio principles">
            <span>Playable first.</span>
            <span>Systems with purpose.</span>
            <span>Built for the long run.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
