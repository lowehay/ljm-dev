import { stackCategories } from "../data";
import "./TechMarquee.css";

const skills = stackCategories.flatMap((c) => c.skills);

// One slow line of the stack; the list is rendered twice so the -50% loop is seamless
export default function TechMarquee() {
  return (
    <div className="tech-marquee overflow-hidden py-2 print:hidden" aria-label="Tech stack">
      <div className="tech-marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 text-sm font-mono text-muted">
            {skills.map((s) => (
              <li key={s} className="flex items-center whitespace-nowrap after:content-['·'] after:px-4 after:text-line-strong">
                {s}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
