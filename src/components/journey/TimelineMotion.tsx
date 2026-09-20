"use client";

import { useEffect, useRef } from "react";

export default function TimelineMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-milestone]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let positions: number[] = [];
    let frame = 0;
    let current = -1;
    const update = () => {
      frame = 0;
      const focus = window.scrollY + window.innerHeight * 0.45;
      const start = positions[0] ?? 0;
      const end = positions.at(-1) ?? start;
      const progress = Math.max(0, Math.min(1, (focus - start) / Math.max(1, end - start)));
      list.style.setProperty("--journey-progress", String(progress));
      const active = positions.reduce((last, top, index) => focus >= top ? index : last, -1);
      if (active !== current) {
        current = active;
        items.forEach((item, index) => {
          item.dataset.active = String(index === active);
          item.dataset.complete = String(index < active);
          const link = item.querySelector(".journey-date a");
          if (index === active) link?.setAttribute("aria-current", "step");
          else link?.removeAttribute("aria-current");
        });
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      positions = items.map((item) => item.getBoundingClientRect().top + window.scrollY + 14);
      list.style.setProperty("--journey-line-height", `${(positions.at(-1) ?? 0) - (positions[0] ?? 0)}px`);
      schedule();
    };
    const animations: Animation[] = [];
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer?.unobserve(entry.target);
            if (reduced.matches || typeof entry.target.animate !== "function") return;
            // No hidden CSS initial state: content survives JS/hydration failures.
            entry.target.querySelectorAll("[data-journey-reveal]").forEach((node, index) => {
              animations.push(node.animate([
                { opacity: 0, transform: "translateY(24px)" },
                { opacity: 1, transform: "translateY(0)" },
              ], { duration: 600, delay: index * 80, easing: "cubic-bezier(.22,1,.36,1)" }));
            });
          });
        }, { threshold: 0.08 })
      : null;
    items.forEach((item) => observer?.observe(item));
    const stopMotion = () => { if (reduced.matches) animations.forEach((animation) => animation.cancel()); };
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", stopMotion);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resize.disconnect();
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", stopMotion);
    };
  }, []);

  return <ol ref={ref} className="journey-timeline">{children}</ol>;
}
