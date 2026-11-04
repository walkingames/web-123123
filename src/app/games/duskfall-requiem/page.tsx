import type { Metadata } from "next";
import GameLandingPage from "@/components/GameLandingPage";
import { lastModified, siteName, siteUrl } from "@/lib/site";

const route = "/games/duskfall-requiem";
const title = "Duskfall Requiem — Dark Fantasy Action Concept | WalkinGames";
const description = "Explore Duskfall Requiem, a dark fantasy action vision project from WalkinGames, imagined around deliberate combat, ancient runes, and a world being consumed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: route },
  openGraph: { title, description, url: route, type: "website", images: [{ url: "/images/DuskfallRequiem.png", alt: "Duskfall Requiem concept art" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/DuskfallRequiem.png"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: title,
      description,
      url: `${siteUrl}${route}`,
      dateModified: lastModified.duskfall,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: {
        "@type": "VideoGame",
        name: "Duskfall Requiem",
        description,
        genre: ["Dark fantasy", "Action"],
        gamePlatform: ["PC", "Console"],
        image: `${siteUrl}/images/DuskfallRequiem.png`,
        url: `${siteUrl}${route}`,
      },
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Games", item: `${siteUrl}/#games` },
      { "@type": "ListItem", position: 3, name: "Duskfall Requiem", item: `${siteUrl}${route}` },
    ] },
  ],
};

export default function DuskfallRequiemPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <GameLandingPage
      title="Duskfall Requiem"
      eyebrow="WalkinGames / Game 02"
      status="Vision project"
      summary="A dark fantasy action concept about deliberate combat, ancient runes, and impossible odds."
      description={[
        "Duskfall Requiem explores a harsher world being consumed by an ancient threat. Its creative direction centers on weighty encounters, a distinct dark-fantasy atmosphere, and choices made under pressure.",
        "This is a vision project for WalkinGames' future, not an announced release. The concept is being explored for PC and console; no release date or feature list has been announced.",
      ]}
      image="/images/DuskfallRequiem.png"
      imageAlt="A lone armored warrior facing a vast skeleton army"
      genre="Dark fantasy · Action"
      platforms="PC · Console concept"
      features={[
        { title: "Deliberate combat", description: "A combat direction built around considered actions and meaningful encounters." },
        { title: "Ancient runes", description: "A world shaped by old powers and the traces they leave behind." },
        { title: "Impossible odds", description: "A lone struggle against a world and its forces growing darker." },
        { title: "A future vision", description: "An exploratory project that represents a possible future for the studio." },
      ]}
    />
  </>;
}
