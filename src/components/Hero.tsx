"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import ShinyText from "./ShinyText";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* ─── scroll parallax ─── */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.85]);

  /* ─── on-load intro (instant when reduced motion) ─── */
  const introTransition = (delay: number, duration: number) => ({
    duration: prefersReducedMotion ? 0 : duration,
    ease,
    delay: prefersReducedMotion ? 0 : delay,
  });

  const stagger = (index: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: introTransition(0.2 + index * 0.08, 0.5),
  });

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="hero"
      aria-labelledby="hero-heading"
      style={{ opacity: sectionOpacity }}
    >
      {/* ─── background image (parallax on wrapper, settle animation on img) ─── */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: -3, y: imageY }}
        aria-hidden="true"
      >
        <Image
          src="/images/walkin-about-hero.png"
          alt="Walkin gameplay scene with a runner escaping through a city street"
          fill
          preload
          unoptimized
          sizes="100vw"
          className="hero__image"
        />
      </motion.div>

      <div className="hero__shade" aria-hidden="true" />

      {/* ─── content (parallax + staggered entrance) ─── */}
      <motion.div className="hero__content shell" style={{ y: contentY }}>
        <motion.div className="hero__eyebrow" {...stagger(0)}>
          <span className="signal-dot signal-dot--hero" aria-hidden="true" />
          Independent game studio · Mobile &amp; PC
        </motion.div>

        <h1 id="hero-heading" className="hero__title">
          <motion.span {...stagger(1)} style={{ display: "block" }}>
            Games built
          </motion.span>
          <ShinyText
            text="to keep moving."
            speed={3.8}
            delay={0}
            color="#ffffff"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            outlined
            strokeWidth={1}
            className="hero__title-shine"
          />
        </h1>

        <motion.div className="hero__footer" {...stagger(3)}>
          <p className="hero__intro">
            WalkinGames creates focused, replayable experiences with strong
            atmosphere, responsive systems, and worlds that invite one more run.
          </p>
          <div className="hero__actions">
            <motion.a
              className="button button--solid"
              href="#games"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={introTransition(0.72, 0.6)}
            >
              <span>Explore our games</span>
              <span className="button__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m7 5 5 5-5 5" />
                </svg>
              </span>
            </motion.a>
            <motion.a
              className="text-link"
              href="#direction"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={introTransition(0.78, 0.6)}
            >
              <span>See where we&apos;re going</span>
              <span className="text-link__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m7 5 5 5-5 5" />
                </svg>
              </span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero__index" aria-hidden="true">
        <span>WG / 001</span>
        <span>Scroll to discover</span>
      </div>
    </motion.section>
  );
}
