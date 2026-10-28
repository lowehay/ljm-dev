import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoMetrics from "./components/BentoMetrics";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import TechStack from "./components/TechStack";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-neutral-800 selection:text-white pb-20">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 space-y-16">
        <Hero />
        <BentoMetrics />
        <Projects />
        <Experience />
        <TechStack />
        <Footer />
      </main>
    </div>
  );
}