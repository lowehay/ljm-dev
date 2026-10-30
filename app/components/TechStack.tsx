import Section from "./Section";
import StackCard from "./StackCard";
import { stackCategories } from "../data";

// Each category is one row: a narrow label column, then content-width chips that wrap beside it
export default function TechStack() {
  return (
    <Section id="stack" index="04" title="Tech Stack">
      <div className="divide-y divide-line">
        {stackCategories.map((cat) => (
          <div
            key={cat.category}
            className="py-5 lg:first:pt-0 grid sm:grid-cols-[8rem_1fr] gap-3 sm:gap-6 sm:items-start"
          >
            <h3 className="text-xs font-mono text-muted uppercase tracking-wide sm:pt-2.5">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <StackCard key={skill} name={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
