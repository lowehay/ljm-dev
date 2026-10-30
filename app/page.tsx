import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoMetrics from "./components/BentoMetrics";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import TechStack from "./components/TechStack";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import GradualBlur from "./components/effects/GradualBlur";
import TechMarquee from "./components/TechMarquee";
import { site } from "./site";
import { company, education, stackCategories } from "./data";

// Structured data so search engines understand who the site is about
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Full-Stack Developer",
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  sameAs: [site.github, site.linkedin].filter(Boolean),
  worksFor: { "@type": "Organization", name: company.name },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  address: {
    "@type": "PostalAddress",
    addressRegion: "South Cotabato",
    addressCountry: "PH",
  },
  knowsAbout: stackCategories.flatMap((c) => c.skills),
};

export default function Home() {
  return (
    <div className="min-h-screen text-fg-soft pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <GradualBlur />
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 space-y-16 lg:space-y-20">
        <Hero />
        <Reveal><BentoMetrics /></Reveal>
        <Reveal><TechMarquee /></Reveal>
        <Reveal><Services /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><TechStack /></Reveal>
        <Reveal><Footer /></Reveal>
      </main>
    </div>
  );
}
