import type { Metadata } from "next";
import { site } from "../../site";
import { projects } from "../../data";
import { CaseStudyPage, Decision, List, Section } from "../CaseStudy";

const project = projects.find((p) => p.caseStudy === "/projects/aura-brew")!;

export const metadata: Metadata = {
  title: `${project.title} case study — ${site.name}`,
  description:
    "How I built a scroll-driven 3D landing page for a concept coffee roaster, where one coffee bean travels through every section and changes with the roast you pick.",
  alternates: { canonical: "/projects/aura-brew" },
};

export default function AuraBrewCaseStudy() {
  return (
    <CaseStudyPage
      project={project}
      intro="A landing page for a concept specialty coffee roaster. Instead of static product photos, a single 3D coffee bean follows the visitor down the page and changes with the roast they choose."
      facts={[
        { label: "Role", value: "Solo: design, 3D, frontend" },
        { label: "Year", value: "2026" },
        { label: "Stack", value: "Next.js, Three.js, GSAP" },
        { label: "Hosting", value: "Vercel" },
      ]}
    >
      <Section title="The goal">
        <p className="text-sm leading-relaxed">
          Coffee roaster sites tend to look alike: a hero photo, a grid of bags, an about section. I wanted to try a page
          where the product itself is the guide. One bean stays on screen the whole time, moves into each section as you
          scroll, and reacts to the visitor, so the page feels like one continuous scene instead of stacked blocks.
        </p>
      </Section>

      <Section title="What I built">
        <List
          items={[
            "A full-screen 3D layer behind the page, with a real coffee bean model lit like a studio product shot",
            "Scroll-driven motion that carries the bean through the hero, origin story, and signature brews sections",
            "A roast selector (light, medium, dark) that recolors the bean and the page's accent color",
            "Floating coffee-dust particles and a gentle mouse-follow tilt and parallax",
            "A preloader that tracks the 3D model's download, and a custom cursor for mouse users",
          ]}
        />
      </Section>

      <Section title="Key decisions">
        <div className="space-y-6">
          <Decision title="One 3D scene behind the whole page">
            <p>
              Rather than a separate canvas per section, there&apos;s one fixed, full-screen WebGL layer that sits behind the
              content and ignores clicks. The bean lives there, so it can move smoothly between sections without being
              torn down and recreated, and the page&apos;s normal text and links stay fully usable on top.
            </p>
          </Decision>

          <Decision title="Scroll motion described as waypoints">
            <p>
              The bean&apos;s path is a short list of waypoints, one per section leg, each with a position, size, and
              rotation. GSAP ScrollTrigger ties each leg to that section&apos;s scroll range and eases between them. Tuning
              the path means editing numbers in one list, not hunting through animation code.
            </p>
          </Decision>

          <Decision title="Layered transforms so animations don't fight">
            <p>
              Four things move the bean at once: scrolling, the entrance animation, a pulse when a roast is picked, and the
              mouse tilt. Each one controls its own nested group, so their effects combine instead of overwriting each
              other.
            </p>
          </Decision>

          <Decision title="The roast changes the material, not the model">
            <p>
              Each roast is a preset color and surface roughness: a light roast is tan and matte, a dark roast is nearly
              black with more sheen. Picking one animates the bean&apos;s material toward the preset and shifts the
              site&apos;s accent glow to match. A procedurally generated bump texture adds the small pits of a real roasted
              bean without another image download.
            </p>
          </Decision>

          <Decision title="Shared state without wrapping the page in providers">
            <p>
              The roast picker and the 3D scene live far apart in the component tree. They share state through a tiny
              store read with React&apos;s useSyncExternalStore, so the page itself can stay a server component. The same
              pattern tells the scene when the preloader has finished, so the bean&apos;s entrance plays only once the
              page is revealed.
            </p>
          </Decision>
        </div>
      </Section>

      <Section title="What I'd do next">
        <List
          items={[
            "Convert the bean from an 11 MB OBJ file to a compressed glTF model, which would cut the download dramatically and shorten the preloader",
            "Respect the reduced-motion setting by keeping the bean still for visitors who ask for less motion",
            "Show a static image of the bean on devices without hardware graphics, instead of rendering 3D in software",
          ]}
        />
      </Section>
    </CaseStudyPage>
  );
}
