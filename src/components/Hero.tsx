import Image from "next/image";
import ShinyText from "./ShinyText";

export default function Hero() {
  return (
    <section id="about" className="hero" aria-labelledby="hero-heading">
      <Image
        src="/images/walkin-about-hero.png"
        alt="Walkin gameplay scene with a runner escaping through a city street"
        fill
        preload
        unoptimized
        sizes="100vw"
        className="hero__image"
      />
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content shell">
        <div className="hero__eyebrow">
          <span className="signal-dot signal-dot--hero" aria-hidden="true" />
          Independent game studio · Mobile &amp; PC
        </div>
        <h1 id="hero-heading" className="hero__title">
          Games built
          <ShinyText
            text="to keep moving."
            speed={3.8}
            delay={0}
            color="#ffffff"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            outlined
            strokeWidth={1}
            className="hero__title-shine"
          />
        </h1>
        <div className="hero__footer">
          <p className="hero__intro">
            WalkinGames creates focused, replayable experiences with strong
            atmosphere, responsive systems, and worlds that invite one more run.
          </p>
          <div className="hero__actions">
            <a className="button button--solid" href="#games">
              <span>Explore our games</span>
              <span className="button__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m7 5 5 5-5 5" />
                </svg>
              </span>
            </a>
            <a className="text-link" href="#direction">
              <span>See where we&apos;re going</span>
              <span className="text-link__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m7 5 5 5-5 5" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero__index" aria-hidden="true">
        <span>WG / 001</span>
        <span>Scroll to discover</span>
      </div>
    </section>
  );
}