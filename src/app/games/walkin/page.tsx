import type { Metadata } from "next";
import GameLandingPage from "@/components/GameLandingPage";
import { lastModified, siteName, siteUrl } from "@/lib/site";

const route = "/games/walkin";
const title = "Walkin — Mobile Action Runner Game | WalkinGames";
const description = "Discover Walkin, a mobile action runner set in a zombie-infested Brooklyn. Run through changing streets, aim with one thumb, fight or evade, and adapt your build.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: route },
  openGraph: { title, description, url: route, type: "website", images: [{ url: "/images/walkin-wallpaper.png", alt: "Walkin game key art" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/walkin-wallpaper.png"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: title,
      description,
      url: `${siteUrl}${route}`,
      dateModified: lastModified.walkin,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: {
        "@type": "VideoGame",
        name: "Walkin",
        description,
        genre: ["Action", "Roguelite", "Infinite runner"],
        gamePlatform: ["Android", "iOS"],
        image: `${siteUrl}/images/walkin-wallpaper.png`,
        url: `${siteUrl}${route}`,
      },
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Games", item: `${siteUrl}/#games` },
      { "@type": "ListItem", position: 3, name: "Walkin", item: `${siteUrl}${route}` },
    ] },
  ],
};

export default function WalkinPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <GameLandingPage
      title="Walkin"
      eyebrow="WalkinGames / Game 01"
      status="In development"
      summary="A mobile action runner through a zombie-infested Brooklyn. Keep moving, take aim, and adapt to survive."
      description={[
        "Walkin combines lane-based movement with one-thumb aiming. Each run puts you on streets where you must decide when to fight, when to evade, and how to respond as the threat changes.",
        "Build a stronger loadout as you move, then use resources and longer-term progression to prepare for another run. Walkin is in development for mobile; no release date is announced.",
      ]}
      image="/images/walkin-wallpaper.png"
      imageAlt="Walkin key art featuring a masked survivor beneath the Walkin title"
      genre="Action roguelite runner"
      platforms="Android · iOS"
      features={[
        { title: "Move and aim", description: "Lane-based running paired with one-thumb aiming, designed for mobile play." },
        { title: "Choose your response", description: "Read changing enemy patterns and decide whether to fight or evade." },
        { title: "Adapt your build", description: "Choose weapons and upgrades during a run, then develop progression over time." },
        { title: "Explore a ruined city", description: "Push through a zombie-infested Brooklyn in search of the next safe haven." },
      ]}
      primaryHref="/waitlist"
      primaryLabel="Join the Walkin waitlist"
      secondaryHref="/walkin/development-journey"
      secondaryLabel="Read the development journey"
    />
  </>;
}
