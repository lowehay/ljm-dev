import LogoLoop from "./LogoLoop/LogoLoop";
import { STACK_ICONS } from "./stackIcons";
import { stackCategories } from "../data";

// Every skill that has a brand logo, drawn in the text color so it follows the theme.
// 1em is LogoLoop's logo height, which it sets as the font size.
const logos = stackCategories
  .flatMap((c) => c.skills)
  .filter((skill) => STACK_ICONS[skill])
  .map((skill) => ({
    title: skill,
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="1em" height="1em">
        <path d={STACK_ICONS[skill].path} />
      </svg>
    ),
  }));

// One slow line of the stack's logos with names; it fades at the edges and pauses on hover
export default function TechMarquee() {
  return (
    <div className="py-2 text-muted print:hidden">
      <LogoLoop
        logos={logos}
        speed={40}
        logoHeight={18}
        gap={36}
        labels="inline"
        pauseOnHover
        fadeOut
        fadeOutWidth={0.12}
        draggable={false}
        ariaLabel="Tech stack"
      />
    </div>
  );
}
