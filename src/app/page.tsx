import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import StudioDirection from "@/components/StudioDirection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SectionTransition from "@/components/motion/SectionTransition";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <SectionTransition />
      <main id="main">
        <div className="hero-stage"><Hero /></div>
        <ProjectShowcase />
        <StudioDirection />
        <ContactSection />
      </main>
    </>
  );
}