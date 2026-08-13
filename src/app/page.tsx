import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import StudioDirection from "@/components/StudioDirection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
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