"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
const NAV_ITEMS = [
  { label: "About Us", href: "#about" },
  { label: "Games", href: "#games" },
  { label: "Contacts", href: "#contacts" },
] as const;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.stopPropagation();
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", href);
    }
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, closeMenu]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] flex justify-center pt-3 sm:pt-4 px-3 sm:px-4"
      role="banner"
    >
      <nav
        className={`flex w-full max-w-[95vw] sm:max-w-[90vw] items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl transition-all duration-300 ${
          scrolled
            ? "bg-nav-bg backdrop-blur-xl border border-border shadow-lg"
            : "bg-nav-bg backdrop-blur-sm border border-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="flex-shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded"
          aria-label="WalkinGames - Back to top"
        >
          <Image
            src="/WalkinGames.com.png"
            alt=""
            width={160}
            height={64}
            priority
            className="h-10 sm:h-[42px] w-auto"
            style={{ width: "auto", height: 42 }}
          />
        </a>

        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} role="listitem">
              <a
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className={`relative text-sm tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm ${
                  activeSection === item.href.slice(1)
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
                aria-current={activeSection === item.href.slice(1) ? "true" : undefined}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground rounded-full" aria-hidden="true" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-full text-muted hover:text-foreground hover:bg-border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 rounded-xl bg-nav-bg backdrop-blur-xl border border-border shadow-lg p-4 md:hidden"
          role="menu"
        >
          <ul className="flex flex-col gap-3" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} role="none">
                <a
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  className={`block px-4 py-2.5 rounded-xl text-sm tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                    activeSection === item.href.slice(1)
                      ? "text-foreground bg-border"
                      : "text-muted hover:text-foreground hover:bg-border/50"
                  }`}
                  role="menuitem"
                  aria-current={activeSection === item.href.slice(1) ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
