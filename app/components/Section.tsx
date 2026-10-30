import DecryptedText from "./effects/DecryptedText";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  as?: "section" | "footer";
  // Classes for the content column (e.g. vertical spacing)
  className?: string;
  children: React.ReactNode;
};

// Stacked heading on small screens; on large screens the label moves into a sticky left column
export default function Section({ id, index, title, as: Tag = "section", className = "", children }: SectionProps) {
  return (
    <Tag
      id={id}
      className="pt-4 lg:pt-6 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12 lg:border-t lg:border-line"
    >
      <div className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-xs font-mono uppercase tracking-wider leading-relaxed text-muted border-b border-line pb-3 mb-2 lg:border-0 lg:pb-0 lg:mb-0">
          <span className="text-accent">{index}</span> — <DecryptedText text={title.toUpperCase()} />
        </h2>
      </div>
      <div className={className}>{children}</div>
    </Tag>
  );
}
