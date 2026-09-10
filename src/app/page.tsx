import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import StudioDirection from "@/components/StudioDirection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <ProjectShowcase />
        <StudioDirection />
        <ContactSection />
      </main>
    </>
  );
}