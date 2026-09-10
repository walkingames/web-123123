"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

const NAV_ITEMS: { label: string; href: string; mega?: { title: string; image: string; imageAlt: string; href: string }[] }[] = [
  { label: "Studio", href: "#studio" },
  {
    label: "Games",
    href: "#games",
    mega: [
      { title: "Walkin", image: "/images/walkinSayko.png", imageAlt: "Walkin key art", href: "#project-walkin" },
      { title: "Duskfall Requiem", image: "/images/DuskfallRequiem.png", imageAlt: "Duskfall Requiem key art", href: "#project-duskfall-requiem" },
    ],
  },
  { label: "Direction", href: "#direction" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const programmaticScrollUntilRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

      const marker = scrollY + 120;
      let current = "";
      for (const { href } of NAV_ITEMS) {
        const id = href.slice(1);
        const section = document.getElementById(id);
        const sectionTop = section
          ? section.getBoundingClientRect().top + scrollY
          : Number.POSITIVE_INFINITY;
        if (sectionTop <= marker) {
          current = id;
        }
      }
      setActiveSection(current);

      // Smart hide/show — keep the site visible at the top and while a nav
      // click is still settling; hide only on sustained downward scroll
      // (slow reading scrolls stay visible), reveal on any upward scroll.
      const settling = Date.now() < programmaticScrollUntilRef.current;
      if (settling || scrollY <= 24) {
        setHidden(false);
      } else if (scrollY < lastScrollYRef.current) {
        setHidden(false);
      } else if (scrollY > lastScrollYRef.current + 4) {
        setHidden(true);
      }
      lastScrollYRef.current = scrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const navigateTo = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    // Keep the navbar visible while the smooth scroll is in flight;
    // otherwise the auto-hide would swallow it mid-animation.
    programmaticScrollUntilRef.current = Date.now() + 1200;
    setHidden(false);

    const top = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", href);
    setActiveSection(href.slice(1));
    setMegaOpen(false);
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
    <>
      <header
        className={`site-header ${scrolled ? "site-header--scrolled" : ""} ${
          hidden && !menuOpen ? "site-header--hidden" : ""
        }`}
      >
        <nav className="site-nav shell" aria-label="Main navigation">
          <a href="#about" className="wordmark" aria-label="WalkinGames - Back to top">
            <span className="wordmark__mark" aria-hidden="true">W</span>
            <span className="wordmark__label">Walkin<span>Games</span></span>
          </a>

          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className={item.mega ? "nav-links__item--mega" : undefined}
                onMouseEnter={() => { if (item.mega) setMegaOpen(true); }}
                onMouseLeave={() => { if (item.mega) setMegaOpen(false); }}
              >
                <a
                  href={item.href}
                  onClick={(event) => navigateTo(event, item.href)}
                  className={`nav-link ${activeSection === item.href.slice(1) ? "nav-link--active" : ""}`}
                  aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
                  onFocus={() => { if (item.mega) setMegaOpen(true); }}
                >
                  {item.label}
                </a>
                {item.mega && megaOpen && item.label === "Games" && (
                  <div
                    className="nav-mega"
                    role="menu"
                    aria-label="Games"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setMegaOpen(false);
                      }
                    }}
                  >
                    {item.mega.map((game) => (
                      <a
                        key={game.title}
                        href={game.href}
                        className="nav-mega__card"
                        role="menuitem"
                        onClick={(e) => navigateTo(e, game.href)}
                      >
                        <span className="nav-mega__thumb">
                          <Image src={game.image} alt={game.imageAlt} fill sizes="120px" className="nav-mega__img" />
                        </span>
                        <span className="nav-mega__label">{game.title}</span>
                      </a>
                    ))}
                  </div>
                )}
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
      {megaOpen && <div className="nav-mega-blur" aria-hidden="true" />}
    </>
  );
}