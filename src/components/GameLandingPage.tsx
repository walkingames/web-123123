import Image from "next/image";
import Link from "next/link";
import StudioPageFrame from "./StudioPageFrame";

type GameLandingPageProps = {
  title: string;
  eyebrow: string;
  status: string;
  summary: string;
  description: string[];
  image: string;
  imageAlt: string;
  genre: string;
  platforms: string;
  features: { title: string; description: string }[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function GameLandingPage({
  title, eyebrow, status, summary, description, image, imageAlt, genre, platforms,
  features, primaryHref, primaryLabel, secondaryHref, secondaryLabel,
}: GameLandingPageProps) {
  return (
    <StudioPageFrame>
      <main id="main" className="studio-page__main shell">
        <article className="studio-game">
          <div className="studio-game__hero">
            <div className="studio-game__copy">
              <p className="section-kicker">{eyebrow} / {status}</p>
              <h1>{title}</h1>
              <p className="studio-game__summary">{summary}</p>
              {description.map((paragraph) => <p className="studio-game__description" key={paragraph}>{paragraph}</p>)}
              <div className="studio-game__actions">
                {primaryHref && primaryLabel && <Link className="button button--solid" href={primaryHref}>{primaryLabel} <span aria-hidden="true">↗</span></Link>}
                {secondaryHref && secondaryLabel && <Link className="text-link" href={secondaryHref}>{secondaryLabel} <span aria-hidden="true">↗</span></Link>}
              </div>
            </div>
            <figure className="studio-game__art">
              <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 760px) 92vw, 42vw" />
              <figcaption>{title} / {status}</figcaption>
            </figure>
          </div>
          <dl className="studio-game__facts">
            <div><dt>Genre</dt><dd>{genre}</dd></div>
            <div><dt>Platforms</dt><dd>{platforms}</dd></div>
            <div><dt>Project status</dt><dd>{status}</dd></div>
          </dl>
          <section className="studio-game__section" aria-labelledby="game-details-title">
            <p className="section-kicker">The game / What to expect</p>
            <h2 id="game-details-title">Built around<br /><span>the feeling.</span></h2>
            <ul className="studio-game__feature-list">
              {features.map((feature) => <li key={feature.title}><strong>{feature.title}</strong>{feature.description}</li>)}
            </ul>
          </section>
        </article>
      </main>
    </StudioPageFrame>
  );
}
