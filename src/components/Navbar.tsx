"use client";

import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";

const NAV_ITEMS = [
  { label: "Studio", href: "#studio" },
  { label: "Games", href: "#games" },
  { label: "Direction", href: "#direction" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const marker = window.scrollY + 120;
      let current = "";
      for (const { href } of NAV_ITEMS) {
        const id = href.slice(1);
        const section = document.getElementById(id);
        const sectionTop = section
          ? section.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;
        if (sectionTop <= marker) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const navigateTo = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", href);
    setActiveSection(href.slice(1));
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, menuOpen]);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <nav className="site-nav shell" aria-label="Main navigation">
        <a href="#about" className="wordmark" aria-label="WalkinGames - Back to top">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span className="wordmark__label">Walkin<span>Games</span></span>
        </a>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(event) => navigateTo(event, item.href)}
                className={`nav-link ${activeSection === item.href.slice(1) ? "nav-link--active" : ""}`}
                aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a className="nav-contact" href="mailto:hello@walkingames.com">
            <span>Let&apos;s talk</span>
            <span className="nav-contact__icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M5 15 15 5M8 5h7v7" />
              </svg>
            </span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul>
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={activeSection === item.href.slice(1) ? "is-active" : ""}
                onClick={(event) => navigateTo(event, item.href)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span>0{index + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="mobile-menu__mail" href="mailto:hello@walkingames.com" tabIndex={menuOpen ? 0 : -1}>
          hello@walkingames.com {"\u2197\uFE0E"}
        </a>
      </div>
    </header>
  );
}