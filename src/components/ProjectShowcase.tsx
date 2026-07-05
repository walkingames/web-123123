"use client";

import Image from "next/image";

interface Project {
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  tags?: string[];
  stats?: { value: string; label: string }[];
  imageFit?: "cover" | "contain";
  cardAspect?: string;
}

const PROJECTS: Project[] = [
  {
    title: "Walkin",
    description: [
      "The city has fallen, and a zombie horde now roams the streets. Run, shoot, survive! Every step is more dangerous than the last. Grab upgrade cards as you run to instantly power up your character and expand your arsenal. The zombies you face aren't static: as you progress, you'll encounter mutations that evolve and gain new attack patterns. Each one is weak against a different weapon type, choosing the right weapon at the right moment is the key to survival.",
    ],
    image: "/images/PostWalkin2.png",
    imageAlt: "Walkin game poster",
    imageFit: "contain",
    cardAspect: "9/16",
    tags: ["Zombie", "Infinite Runner", "3D Action"],
    stats: [
      { value: "50+", label: "levels" },
      { value: "12", label: "weapon types" },
      { value: "50+", label: "upgrades" },
      { value: "10+", label: "characters" },
      { value: "iOS / Android", label: "platform" },
    ],
  },
  {
    title: "Dusk Fall Requiem",
    description: [
      "The void is spreading, consuming everything in its path. Battle through hordes of corrupted creatures in a dying world, master ancient runes, and uncover the truth behind the fall. Each realm is a sprawling battlefield. Adapt your strategy, upgrade your relics, and face colossal bosses that tower over the ruins.",
    ],
    image: "/images/DuskfallRequiem.png",
    imageAlt: "Dusk Fall Requiem game poster showing dark fantasy artwork",
    tags: ["Action RPG", "Dark Fantasy", "Souls-like"],
    stats: [
      { value: "40+", label: "boss encounters" },
      { value: "6", label: "realm regions" },
      { value: "20+", label: "relic upgrades" },
      { value: "8", label: "playable classes" },
      { value: "PC / Console", label: "platform" },
    ],
  },
];

export default function ProjectShowcase() {
  return (
    <section
      id="games"
      className="scroll-offset relative px-4 sm:px-6 py-20 md:py-32 blueprint-grid"
      aria-labelledby="games-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 md:mb-16 text-center">
          <h2
            id="games-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-pretty"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
          >
            Our Games
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-muted text-xs sm:text-sm leading-relaxed text-pretty">
            Each project is crafted with care, blending unique art styles with engaging gameplay.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-32">
          {PROJECTS.map((project, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <article
                key={project.title}
                className={`flex flex-col md:flex-row items-stretch gap-6 md:gap-12 lg:gap-16 ${
                  isReversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="relative w-full md:w-[38%] lg:w-[40%] flex-shrink-0">
                  <div className="relative w-full rounded-2xl overflow-hidden border blueprint-dash shadow-[0_0_40px_-15px_var(--glow)] group" style={{ aspectRatio: project.cardAspect || "2/3", background: project.imageFit === "contain" ? "#0a0a0c" : "", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
                      className={`${project.imageFit === "contain" ? "object-contain" : "object-cover"} transition-all duration-700 ease-out group-hover:scale-105`}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  </div>
                </div>

                {project.stats ? (
                  <div className="flex-1 flex flex-col rounded-2xl p-6 sm:p-8 md:p-10" style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Zone 1 — Genre Tags */}
                    <div className="flex flex-wrap gap-2 mb-3" role="list" aria-label="Game tags">
                      {project.tags?.map((tag, ti) => (
                        <span
                          key={tag}
                          role="listitem"
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{
                            background: ti === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)",
                            color: ti === 0 ? "#c8c8ca" : "#c8c8ca",
                            padding: "4px 10px",
                            fontSize: "12px",
                            borderRadius: "20px",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (ti === 0) { e.currentTarget.style.background = "rgba(232,25,44,0.15)"; e.currentTarget.style.color = "#ff6b6b"; }
                          }}
                          onMouseLeave={(e) => {
                            if (ti === 0) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#c8c8ca"; }
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Zone 2 — Title */}
                    <h3 className="mb-2" style={{ fontSize: "26px", fontWeight: 500, color: "#fff" }}>
                      {project.title}
                    </h3>

                    {/* Zone 3 — Description */}
                    <div className="space-y-2" style={{ maxWidth: "380px" }}>
                      {project.description.map((line) => (
                        <p key={line} style={{ fontSize: "14px", color: "#a0a0a4", lineHeight: 1.6 }}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Zone 4 — Stats Row */}
                    <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", borderBottom: "0.5px solid rgba(255,255,255,0.1)", padding: "14px 0", marginTop: "16px" }}>
                      <div className="flex flex-wrap" style={{ gap: "16px 20px" }}>
                        {project.stats.map((stat) => (
                          <div key={stat.label}>
                            <div style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>{stat.value}</div>
                            <div style={{ fontSize: "11px", color: "#808084", marginTop: "2px" }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Zone 5 — CTA Row */}
                    <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                      <div className="flex items-center gap-3">
                        <a
                          href="#"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.1)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            textDecoration: "none",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#E8192C"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                          aria-label={`Learn more about ${project.title}`}
                        >
                          Learn more
                        </a>
                        <span style={{ fontSize: "12px", color: "#707074" }}>
                          Pre-registration opening soon
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center rounded-2xl bg-card-bg backdrop-blur-md border border-border p-6 sm:p-8 md:p-10 space-y-4 md:space-y-5">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-pretty">
                      {project.title}
                    </h3>

                    <div className="space-y-2">
                      {project.description.map((line) => (
                        <p key={line} className="text-muted leading-relaxed text-xs sm:text-sm text-pretty">
                          {line}
                        </p>
                      ))}
                    </div>

                    {project.tags && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2" role="list" aria-label="Game tags">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full bg-border text-muted"
                            role="listitem"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground hover:opacity-70 transition-opacity group/link pt-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-sm"
                      aria-label={`Learn more about ${project.title}`}
                    >
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
