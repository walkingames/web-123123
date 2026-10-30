"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./studio-info.css";

/** The same explanation is available to hover, keyboard and touch users. */
export default function StudioInfo() {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (hovered || focused || pinned);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => {
      setPinned(false);
      setDismissed(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) dismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="studio-info"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setHovered(true);
        setDismissed(false);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => {
        setFocused(true);
        setDismissed(false);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
          setPinned(false);
        }
      }}
    >
      <button
        type="button"
        className="studio-info__trigger"
        aria-label="About the studio"
        aria-describedby={id}
        aria-controls={id}
        aria-expanded={open}
        onClick={() => {
          // Pin separately from focus: a first touch focuses before its click.
          // A single open/toggle state would immediately close on that first tap.
          setPinned(!pinned);
          setDismissed(pinned);
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10.5v6M12 7.5v.5" strokeLinecap="round" />
        </svg>
      </button>
      <div id={id} role="tooltip" className="studio-info__tooltip" hidden={!open}>
        WalkinGames is an independent studio co-founded and run by Yusuf Okuducu and Emrehan Dalaman.
      </div>
    </div>
  );
}
