"use client";

import { useEffect, useRef } from "react";

const DESTINATIONS: Record<string, string> = {
  about: "WalkinGames",
  studio: "The studio",
  games: "Our worlds",
  "project-walkin": "Walkin",
  "project-duskfall-requiem": "Duskfall Requiem",
  direction: "The path ahead",
  contact: "Next world.",
};

/** A real cover → relocate → uncover transition; native scrolling stays native. */
export default function SectionTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const accent = accentRef.current;
    if (!curtain || !accent) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    let generation = 0;
    let pending: HTMLElement | null = null;
    const focusCleanups = new Set<() => void>();

    function focusDestination(target: HTMLElement) {
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        const cleanup = () => {
          target.removeAttribute("tabindex");
          target.removeEventListener("blur", cleanup);
          focusCleanups.delete(cleanup);
        };
        focusCleanups.add(cleanup);
        target.addEventListener("blur", cleanup, { once: true });
      }
      target.focus({ preventScroll: true });
    }

    function relocate(target: HTMLElement) {
      // A sticky hero's measured document position changes while scrolling.
      const top = target.id === "about" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92);
      window.scrollTo({ top, behavior: "instant" });
      window.history.replaceState(null, "", `#${target.id}`);
      focusDestination(target);
      pending = null;
    }

    function cancel() {
      generation += 1;
      animations.forEach((animation) => animation.cancel());
      animations = [];
      curtain!.dataset.phase = "idle";
    }

    async function navigate(target: HTMLElement) {
      cancel();
      if (preference.matches || typeof curtain!.animate !== "function" || Math.abs(target.getBoundingClientRect().top - 92) < 3) {
        relocate(target);
        return;
      }
      const current = generation;
      pending = target;
      if (titleRef.current) titleRef.current.textContent = DESTINATIONS[target.id];
      curtain!.dataset.phase = "covering";
      const easing = "cubic-bezier(0.76, 0, 0.24, 1)";
      animations = [
        accent!.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 560, easing, fill: "forwards" }),
        curtain!.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 560, delay: 12, easing, fill: "forwards" }),
      ];
      try {
        await Promise.all(animations.map((animation) => animation.finished));
        if (current !== generation) return;
        relocate(target);
        curtain!.dataset.phase = "revealing";
        animations.forEach((animation) => animation.cancel());
        animations = [
          curtain!.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 630, easing, fill: "forwards" }),
          accent!.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 630, easing, fill: "forwards" }),
        ];
        await Promise.all(animations.map((animation) => animation.finished));
        if (current === generation) cancel();
      } catch {
        // A newer destination, Escape, reduced motion or unmount cancelled this run.
      }
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      const id = url.hash.slice(1);
      if (!Object.hasOwn(DESTINATIONS, id)) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      void navigate(target);
    }

    function finishImmediately() {
      const target = pending;
      cancel();
      if (target) relocate(target);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finishImmediately();
    }
    function onPreferenceChange() {
      if (preference.matches) finishImmediately();
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      cancel();
      focusCleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div className="section-transition" aria-hidden="true">
      <div ref={accentRef} className="section-transition__edge" />
      <div ref={curtainRef} className="section-transition__curtain" data-phase="idle">
        <span className="section-transition__wordmark">WalkinGames</span>
        <span ref={titleRef} className="section-transition__title" />
        <span className="section-transition__caption">Independent game studio · Mobile &amp; PC</span>
      </div>
    </div>
  );
}
