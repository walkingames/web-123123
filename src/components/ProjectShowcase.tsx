import Image from "next/image";
import WalkinProjectCard from "./WalkinProjectCard";
import Reveal from "./motion/Reveal";

interface Project {
  slug: string;
  number: string;
  title: string;
  stage: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  details: { label: string; value: string }[];
  tone: "walkin" | "duskfall";
}

const PROJECTS: Project[] = [
  {
    slug: "walkin",
    number: "01",
    title: "Walkin",
    stage: "In development",
    summary: "Run. Adapt. Survive the city.",
    description:
      "A mobile action runner where every street changes the fight. Build your arsenal mid-run, read evolving enemy patterns, and choose the right weapon before the horde closes in.",
    image: "/images/walkinSayko.png",
    imageAlt: "Walkin key art featuring a masked survivor beneath the Walkin title",
    details: [
      { label: "Genre", value: "Action · Infinite Runner" },
      { label: "Platform", value: "Mobile" },
      { label: "Focus", value: "Combat · Progression" },
    ],
    tone: "walkin",
  },
  {
    slug: "duskfall-requiem",
    number: "02",
    title: "Duskfall Requiem",
    stage: "Vision project",
    summary: "Stand against a world being consumed.",
    description:
      "A dark fantasy action concept built around deliberate combat, ancient runes, and impossible odds. Duskfall Requiem explores a larger, harsher world for the studio’s future.",
    image: "/images/DuskfallRequiem.png",
    imageAlt: "A lone armored warrior facing a vast skeleton army",
    details: [
      { label: "Genre", value: "Dark Fantasy · Action" },
      { label: "Platform", value: "PC · Console" },
      { label: "Focus", value: "Combat · Worldbuilding" },
    ],
    tone: "duskfall",
  },
];

export default function ProjectShowcase() {
  return (
    <section className="games-section">
      <section id="studio" className="studio-intro" aria-labelledby="studio-heading">
        <div className="shell">
          <Reveal>
            <p className="section-kicker">The studio / 2026</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="studio-intro__grid">
              <h2 id="studio-heading">
                Small team.<br />Clear intent.<br /><span>Games with a pulse.</span>
              </h2>
              <div className="studio-intro__copy">
                <p>
                  WalkinGames is an independent studio creating games for mobile
                  and PC. We start with a strong playable idea, then build every
                  system around how it should feel in the player&apos;s hands.
                </p>
                <p>
                  Our work moves between immediate arcade energy and darker,
                  atmospheric worlds, always with clarity, iteration, and long-term
                  craft at the center.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div id="games" className="projects" aria-labelledby="games-heading">
        <header className="projects__header shell">
          <Reveal>
            <p className="section-kicker">Selected work / 01-02</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="games-heading">Two worlds.<br /><span>One point of view.</span></h2>
            <p>Current production and the next horizon for WalkinGames.</p>
          </Reveal>
        </header>
        <div className="project-cards shell">
          {PROJECTS.map((project, index) => {
            if (project.tone === "walkin") {
              return (
                <Reveal key={project.title} delay={index * 0.12}>
                  <WalkinProjectCard project={project} />
                </Reveal>
              );
            }

            return (
              <Reveal key={project.title} delay={index * 0.12}>
                <article
                  id={`project-${project.slug}`}
                  className={`project-card project-card--${project.tone}`}
                >
                  <div className="project-card__art">
                    <div className="project-card__poster">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 760px) min(calc(100vw - 90px), 340px), (max-width: 1000px) 34vw, 440px"
                        quality={100}
                        className="project-card__image"
                      />
                    </div>
                  </div>

                  <div className="project-card__content">
                    <div>
                      <div className="project-card__stage">
                        <span className="signal-dot signal-dot--duskfall" aria-hidden="true" />
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
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}