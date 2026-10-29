import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoMetrics from "./components/BentoMetrics";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import TechStack from "./components/TechStack";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <div className="min-h-screen text-neutral-200 pb-20">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 space-y-16">
        <Hero />
        <Reveal><BentoMetrics /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><TechStack /></Reveal>
        <Reveal><Footer /></Reveal>
      </main>
    </div>
  );
}
