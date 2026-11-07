"use client";

import { motion, useScroll, useSpring, useReducedMotion, useTransform } from "motion/react";

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const clipPath = useTransform(scaleX, (progress) => `inset(0 ${(1 - progress) * 100}% 0 0)`);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ clipPath }}
      className="scroll-progress"
    />
  );
}