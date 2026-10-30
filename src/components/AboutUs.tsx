import Reveal from "./motion/Reveal";
import StudioInfo from "./StudioInfo";
import "./about-us.css";

const FOUNDERS = [
  {
    name: "Yusuf Okuducu",
    style: "yusuf",
    links: [
      { kind: "website", label: "Website", href: "https://www.yusufokuducu.com/" },
      { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/yusufokuducu/" },
    ],
  },
  {
    name: "Emrehan Dalaman",
    style: "emrehan",
    links: [
      { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/emrehan-dalaman-1252581b6" },
    ],
  },
] as const;

function ProfileSilhouette({ id }: { id: string }) {
  return (
    <svg className="founder__silhouette" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#363940" />
          <stop offset="100%" stopColor="#181a1f" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M160 54c-31 0-52 24-52 57 0 26 11 47 27 58v15c0 8-7 14-20 18-38 10-60 34-60 72v28h210v-28c0-38-22-62-60-72-13-4-20-10-20-18v-15c16-11 27-32 27-58 0-33-21-57-52-57Z"
      />
    </svg>
  );
}

function ProfileIcon({ kind }: { kind: "website" | "linkedin" }) {
  return kind === "website" ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M5 6.5a15 15 0 0 0 14 0M5 17.5a15 15 0 0 1 14 0" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.31h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.25Z" />
    </svg>
  );
}

export default function AboutUs() {
  return (
    <section id="about-us" className="about-us" aria-labelledby="about-us-heading">
      <div className="shell">
        <Reveal>
          <div className="about-us__header">
            <p className="section-kicker">Team / The people behind the games</p>
            <h2 id="about-us-heading">Two minds.<br /><span>One shared world.</span></h2>
          </div>
        </Reveal>

        <div className="about-us__team">
          {FOUNDERS.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.12}>
              <article className={`founder founder--${founder.style}`} aria-labelledby={`founder-${index}`}>
                <div className="founder__portrait" role="img" aria-label={`Profile image placeholder for ${founder.name}`}>
                  <ProfileSilhouette id={`founder-shadow-${founder.style}`} />
                </div>
                <div className="founder__info">
                  <p className="founder__role">Co-founder</p>
                  <h3 id={`founder-${index}`}>{founder.name}</h3>
                  <p className="founder__discipline">Game Developer</p>
                  <ul className="founder__socials" aria-label={`${founder.name} profiles`}>
                    {founder.links.map((link) => (
                      <li key={link.kind}>
                        <a
                          className="founder__social-link"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${founder.name} — ${link.label} (opens in a new tab)`}
                          title={link.label}
                        >
                          <ProfileIcon kind={link.kind} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="about-us__info"><StudioInfo /></div>
      </div>
    </section>
  );
}
