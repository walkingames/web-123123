"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";

interface WalkinProject {
  slug: string;
  title: string;
  stage: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  details: { label: string; value: string }[];
}

const ARCHITECTURE_LAYERS = [
  {
    index: "01",
    eyebrow: "Player layer",
    title: "Input & Camera",
    tools: ["Input System 1.19", "Cinemachine 3.1", "2-bone IK"],
  },
  {
    index: "02",
    eyebrow: "Game layer",
    title: "Runtime orchestration",
    tools: ["Game state", "Boot sequence", "ScriptableObjects"],
  },
  {
    index: "03",
    eyebrow: "Interop layer",
    title: "Hybrid bridge",
    tools: ["Bridge coordinators", "Event buffers", "Weapon sync"],
  },
  {
    index: "04",
    eyebrow: "Simulation layer",
    title: "DOTS runtime",
    tools: ["Entities 6.5", "Burst 1.8", "Unity Physics"],
  },
  {
    index: "05",
    eyebrow: "Output layer",
    title: "Presentation & delivery",
    tools: ["URP 17.5", "Rukhanka", "Addressables 3.1"],
  },
] as const;

const TOOL_GROUPS = [
  {
    label: "Core runtime",
    value: "Unity 6 · C# · Entities · Collections · Burst",
  },
  {
    label: "Simulation systems",
    value: "Enemy spawning · Projectiles · Collectibles · Progression",
  },
  {
    label: "Rendering stack",
    value: "URP · VFX Graph · Rukhanka ECS animation · Cinemachine",
  },
  {
    label: "Content pipeline",
    value: "Addressables · Remote bundles · ScriptableObject data",
  },
] as const;

export default function WalkinProjectCard({ project }: { project: WalkinProject }) {
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>();
  const overviewRef = useRef<HTMLElement>(null);
  const technicalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const activeSlide = technicalOpen ? technicalRef.current : overviewRef.current;
    if (!activeSlide) return;

    const updateHeight = () => setViewportHeight(activeSlide.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(activeSlide);
    return () => observer.disconnect();
  }, [technicalOpen]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = endX - touchStartX;
    if (Math.abs(distance) >= 52) {
      setTechnicalOpen(distance < 0);
    }
    setTouchStartX(null);
  };

  return (
    <article
      id={`project-${project.slug}`}
      className={`project-card project-card--walkin project-card--interactive${technicalOpen ? " is-technical" : ""}`}
    >
      <div className="project-card__switcher" aria-label="Walkin card view">
        <p>
          <span className="signal-dot signal-dot--dossier" aria-hidden="true" />
          Walkin / Project dossier
        </p>
        <div role="group" aria-label="Choose Walkin card view">
          <button
            type="button"
            className={!technicalOpen ? "is-active" : ""}
            aria-pressed={!technicalOpen}
            onClick={() => setTechnicalOpen(false)}
          >
            Overview
          </button>
          <button
            type="button"
            className={technicalOpen ? "is-active" : ""}
            aria-pressed={technicalOpen}
            onClick={() => setTechnicalOpen(true)}
          >
            Build system <span aria-hidden="true">{"\u2192\uFE0E"}</span>
          </button>
        </div>
      </div>

      <div
        className="project-card__viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={viewportHeight ? { height: `${viewportHeight}px` } : undefined}
      >
        <div className="project-card__track">
          <section
            ref={overviewRef}
            className="project-card__slide project-card__overview"
            aria-label="Walkin overview"
            aria-hidden={technicalOpen}
          >
            <div className="project-card__art">
              <div className="project-card__poster">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 760px) min(82vw, 420px), (max-width: 1100px) 42vw, 520px"
                  quality={100}
                  className="project-card__image"
                />
              </div>
            </div>

            <div className="project-card__content">
              <div>
                <div className="project-card__stage">
                  <span className="signal-dot signal-dot--walkin" aria-hidden="true" />
                  {project.stage}
                </div>
                <h3 className="project-card__title">{project.title}</h3>
              </div>
              <div className="project-card__story">
                <p className="project-card__summary">{project.summary}</p>
                <p className="project-card__description">{project.description}</p>
              </div>
              <dl className="project-card__details">
                {project.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section
            ref={technicalRef}
            className="project-card__slide tech-dossier"
            aria-label="Walkin development system"
            aria-hidden={!technicalOpen}
          >
            <header className="tech-dossier__header">
              <div>
                <p className="tech-dossier__eyebrow">Technical field notes / Runtime architecture</p>
                <h3>How Walkin<br /><span>is built.</span></h3>
              </div>
              <p>
                A hybrid Unity architecture: high-level game flow remains flexible in
                MonoBehaviour while high-volume combat simulation runs through DOTS.
              </p>
            </header>

            <ol className="tech-flow" aria-label="Walkin runtime architecture flow">
              {ARCHITECTURE_LAYERS.map((layer) => (
                <li key={layer.index}>
                  <div className="tech-flow__index">{layer.index}</div>
                  <p>{layer.eyebrow}</p>
                  <h4>{layer.title}</h4>
                  <ul>
                    {layer.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="tech-dossier__lower">
              <dl className="tech-toolchain">
                {TOOL_GROUPS.map((group) => (
                  <div key={group.label}>
                    <dt>{group.label}</dt>
                    <dd>{group.value}</dd>
                  </div>
                ))}
              </dl>

              <aside className="ai-workflow" aria-label="AI-assisted development workflow">
                <div className="ai-workflow__topline">
                  <span>AI-assisted workflow</span>
                  <span>Human directed</span>
                </div>
                <h4>Hermes Agent <span>×</span> Unity MCP</h4>
                <p>
                  Architecture inspection, editor automation and focused verification run
                  through Coplay Unity MCP. Design decisions, play feel and final review stay
                  human-owned.
                </p>
                <ul>
                  <li>Scene and prefab inspection</li>
                  <li>Editor tooling and repeatable setup</li>
                  <li>Regression checks and performance analysis</li>
                </ul>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
