export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-3">
      <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
        <span className="text-accent">{index}</span> — {title}
      </h2>
    </div>
  );
}
