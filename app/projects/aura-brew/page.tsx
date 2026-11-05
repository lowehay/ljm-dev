import type { Metadata } from "next";
import { site } from "../../site";
import { projects } from "../../data";
import { CaseStudyPage, Decision, List, Section } from "../CaseStudy";

const project = projects.find((p) => p.caseStudy === "/projects/aura-brew")!;

export const metadata: Metadata = {
  title: `${project.title} case study — ${site.name}`,
  description:
    "How I built a 3D website for a concept Philippine coffee café, where one coffee bean travels through the page, plus a brew quiz, menu, 3D brewing timer, and map.",
  alternates: { canonical: "/projects/aura-brew" },
};

export default function AuraBrewCaseStudy() {
  return (
    <CaseStudyPage
      project={project}
      intro="A website for a concept specialty café that roasts Philippine coffee. A single 3D coffee bean follows the visitor down the page and changes with the roast they pick. Around it is everything a real café site needs: a menu with prices, beans to take home, events, and directions."
      facts={[
        { label: "Role", value: "Solo: design, 3D, frontend" },
        { label: "Year", value: "2026" },
        { label: "Stack", value: "Next.js, React Three Fiber, Framer Motion" },
        { label: "Hosting", value: "Vercel" },
      ]}
    >
      <Section title="The goal">
        <p className="text-sm leading-relaxed">
          Coffee shop sites tend to look alike: a hero photo, a grid of drinks, an about section. I wanted a page where
          the product itself is the guide. One bean stays on screen, moves into each section as you scroll, and reacts
          to what you do. The first version was only a landing page. I then grew it into a site a café could actually
          run on, with content written to be realistic for a small roaster in Mindanao.
        </p>
      </Section>

      <Section title="What I built">
        <List
          items={[
            "A full-screen 3D layer with a real coffee bean model, lit with a studio light map, that travels through the hero, origin story, signature brews, and quiz",
            "A roast picker (light, medium, dark) that recolors the bean and the page's accent, with a burst of small beans when you change it",
            "A three-question brew finder quiz that recommends a drink and roast and highlights your match on the menu",
            "A full menu in tabs with peso prices, and four 250 g bags of Philippine beans you can preview on the 3D bean",
            "A brew-at-home timer for pour-over, French press, and cold brew, with a 3D brewer that fills, steeps, and presses as the timer runs",
            "A pinned \"cherry to cup\" section with six steps, a progress rail, and a swatch that changes color from red cherry to roasted brown",
            "Events with their next real dates, a demo loyalty stamp card, a drink suggestion based on live weather, and a live open or closed status in Manila time",
            "A visit section with a map, directions, and an FAQ",
          ]}
        />
      </Section>

      <Section title="Key decisions">
        <div className="space-y-6">
          <Decision title="One 3D scene behind the whole page">
            <p>
              Rather than a separate canvas per section, there&apos;s one fixed, full-screen WebGL layer that sits behind the
              content and ignores clicks. The bean lives there, so it can move smoothly between sections without being
              torn down and recreated, and the page&apos;s text and links stay fully usable on top.
            </p>
          </Decision>

          <Decision title="A bean path measured from the page, not hard-coded">
            <p>
              My first version used scroll-tied animations per section. Scrolling back up quickly made them fight each
              other, and the bean could end up in the wrong spot. Now the page measures where each section sits, the
              bean&apos;s target pose is worked out from the scroll position, and the bean eases toward it every frame. It
              can&apos;t get stuck, and it lines up with the glow behind it on any screen size. Phones get their own path
              that keeps the bean in a corner, away from the text.
            </p>
          </Decision>

          <Decision title="A 92% smaller model with the same detail">
            <p>
              The bean started as an 11.5 MB OBJ file. I converted it to a compressed glTF model at 871 KB, keeping the
              original surface normals so it still looks like a real bean, plus a 68 KB low-detail copy for the burst
              effect. The studio lighting map is self-hosted and shrunk to 131 KB. The preloader now waits until the 3D
              scene is actually ready, so the page never appears with the bean missing.
            </p>
          </Decision>

          <Decision title="The roast changes the material, not the model">
            <p>
              Each roast is a preset color and surface roughness: a light roast is tan and matte, a dark roast is nearly
              black with more sheen. Picking one animates the bean&apos;s material toward the preset and shifts the
              site&apos;s accent glow to match. The quiz and the beans for sale use the same presets, so a recommendation
              shows up on the 3D bean straight away.
            </p>
          </Decision>

          <Decision title="3D only where the device can handle it">
            <p>
              On computers without hardware graphics, the browser draws WebGL on the CPU, which is slow. The site checks
              which renderer it got and switches to a lighter mode: fewer pixels, no coffee dust, no burst. The 3D brewer
              shows a simple progress ring instead and only renders while it&apos;s on screen. Visitors who ask for
              reduced motion get a still bean and no extra animation.
            </p>
          </Decision>

          <Decision title="Fixing what visitors would notice">
            <p>
              I tested every navbar link to check that each section lands fully in view. One didn&apos;t: the browser
              cancels a smooth scroll if content resizes while it&apos;s running, and the pinned journey section grew and
              shrank as steps opened. Giving it a fixed layout fixed the jump. I also fixed hydration errors, including
              one caused by a browser extension, by making sure the server and browser render the same markup and doing
              anything that depends on the date or weather after the page loads.
            </p>
          </Decision>
        </div>
      </Section>

      <Section title="What I'd do next">
        <List
          items={[
            "Connect the menu and events to a small CMS, so the café could change prices and dates without code",
            "Add real online ordering for pickup once there's a shop behind it, since this concept site deliberately has no checkout",
            "Test the 3D scenes on more low-end phones and tune the lighter mode from what I find",
          ]}
        />
      </Section>
    </CaseStudyPage>
  );
}
