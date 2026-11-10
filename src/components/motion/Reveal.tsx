"use client";

import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Fades a block in the first time it enters the viewport.
 *
 * Important: the hidden state only ever exists inside the animation, never in
 * the server-rendered markup or in a CSS rule. A blocked/stripped JS bundle, a
 * broken hydration, an ad-blocked chunk or a proxy that rewrites the HTML then
 * leaves the page fully readable instead of blank (the copy used to ship with
 * inline `opacity: 0`, which is exactly what happened on proxied loads).
 */
export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined" || typeof el.animate !== "function") {
      return;
    }

    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          animations.push(
            entry.target.animate(
              [
                { opacity: 0, transform: `translateY(${y}px)` },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 700,
                delay: delay * 1000,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both",
              },
            ),
          );
        }
      },
      // Use a zero margin so anchor jumps and small mobile viewports still
      // trigger the reveal as soon as any part of the element enters the view.
      { threshold: 0.01, rootMargin: "0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} data-reveal="true" className={className}>
      {children}
    </div>
  );
}
