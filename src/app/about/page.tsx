import type { Metadata } from "next";
import Link from "next/link";
import StudioPageFrame from "@/components/StudioPageFrame";
import { lastModified, siteName, siteUrl } from "@/lib/site";

const route = "/about";
const title = "About WalkinGames — Independent Game Studio";
const description = "Meet WalkinGames, the independent game studio co-founded by Yusuf Okuducu and Emrehan Dalaman, creating Walkin and exploring Duskfall Requiem.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: route },
  openGraph: { title, description, url: route, type: "website", images: [{ url: "/opengraph-image", alt: "WalkinGames independent game studio" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: title,
      description,
      url: `${siteUrl}${route}`,
      dateModified: lastModified.about,
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      founder: [
        { "@type": "Person", name: "Yusuf Okuducu", url: "https://www.yusufokuducu.com/", sameAs: ["https://www.linkedin.com/in/yusufokuducu/"] },
        { "@type": "Person", name: "Emrehan Dalaman", sameAs: ["https://www.linkedin.com/in/emrehan-dalaman-1252581b6"] },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}${route}` },
    ] },
  ],
};

export default function AboutPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <StudioPageFrame>
      <main id="main" className="studio-page__main shell">
        <article className="studio-about">
          <header className="studio-about__hero">
            <p className="section-kicker">About / WalkinGames</p>
            <h1>Small team.<br /><span>Games with a pulse.</span></h1>
            <p className="studio-about__lead">WalkinGames is an independent game studio co-founded by Yusuf Okuducu and Emrehan Dalaman, creating focused, replayable experiences for mobile and PC.</p>
            <div className="studio-about__copy">
              <p>We start with a strong playable idea, then build every system around how it should feel in the player&apos;s hands. Our work moves between immediate arcade energy and darker, atmospheric worlds.</p>
              <p>Clarity, iteration, and long-term craft guide the process. Our current work includes Walkin, a mobile action runner in development, and Duskfall Requiem, a dark fantasy action vision project.</p>
            </div>
          </header>
          <section className="studio-about__section" aria-labelledby="founders-title">
            <p className="section-kicker">The people / Co-founders</p>
            <h2 id="founders-title">The team behind<br /><span>the games.</span></h2>
            <div className="studio-about__people">
              <article className="studio-about__person">
                <h3>Yusuf Okuducu</h3>
                <p>Co-founder · Game Developer</p>
                <a href="https://www.yusufokuducu.com/" target="_blank" rel="noopener noreferrer">Personal website ↗</a>
                <a href="https://www.linkedin.com/in/yusufokuducu/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </article>
              <article className="studio-about__person">
                <h3>Emrehan Dalaman</h3>
                <p>Co-founder · Game Developer</p>
                <a href="https://www.linkedin.com/in/emrehan-dalaman-1252581b6" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </article>
            </div>
          </section>
          <section className="studio-about__section studio-about__next" aria-labelledby="work-title">
            <p className="section-kicker">Selected work / 01—02</p>
            <h2 id="work-title">Two worlds.<br /><span>One point of view.</span></h2>
            <div className="studio-about__people">
              <article className="studio-about__person">
                <h3><Link href="/games/walkin">Walkin ↗</Link></h3>
                <p>A mobile action runner set in a zombie-infested Brooklyn. In development for Android and iOS.</p>
              </article>
              <article className="studio-about__person">
                <h3><Link href="/games/duskfall-requiem">Duskfall Requiem ↗</Link></h3>
                <p>A dark fantasy action vision project imagined for PC and console.</p>
              </article>
            </div>
            <div className="studio-game__actions"><a className="button button--solid" href="mailto:hello@walkingames.com">Contact the studio <span aria-hidden="true">↗</span></a></div>
          </section>
        </article>
      </main>
    </StudioPageFrame>
  </>;
}
