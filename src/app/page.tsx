import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import StudioDirection from "@/components/StudioDirection";
import AboutUs from "@/components/AboutUs";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SectionTransition from "@/components/motion/SectionTransition";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icons/icon-512.png`,
      description: siteDescription,
      founder: [
        {
          "@type": "Person",
          name: "Yusuf Okuducu",
          url: "https://www.yusufokuducu.com/",
          sameAs: ["https://www.linkedin.com/in/yusufokuducu/"],
        },
        {
          "@type": "Person",
          name: "Emrehan Dalaman",
          sameAs: ["https://www.linkedin.com/in/emrehan-dalaman-1252581b6"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ScrollProgress />
      <Navbar />
      <SectionTransition />
      <main id="main">
        <div className="hero-stage"><Hero /></div>
        <ProjectShowcase />
        <StudioDirection />
        <AboutUs />
        <ContactSection />
      </main>
    </>
  );
}