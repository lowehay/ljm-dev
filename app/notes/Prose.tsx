// Small building blocks for writing notes in JSX, styled to match the case study pages

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-fg tracking-tight pt-4">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm sm:text-[15px] leading-relaxed">{children}</p>;
}

export function C({ children }: { children: React.ReactNode }) {
  return <code className="px-1 py-0.5 rounded bg-surface border border-line text-[0.9em] font-mono text-fg">{children}</code>;
}

export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="rounded-xl border border-line bg-surface overflow-hidden">
      {label && <figcaption className="px-4 py-2 border-b border-line text-[11px] font-mono text-muted">{label}</figcaption>}
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-fg-soft">
        <code>{children.trim()}</code>
      </pre>
    </figure>
  );
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="text-sm sm:text-[15px] leading-relaxed space-y-1.5 list-disc pl-5 marker:text-line-strong">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: { label: string; before?: string; after: string }[] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-xl border border-line bg-surface px-4 py-3">
          <dt className="text-xs font-mono text-muted">{s.label}</dt>
          <dd className="mt-1 text-sm text-fg">
            {s.before && (
              <>
                <span className="text-muted line-through decoration-line-strong">{s.before}</span>
                <span className="mx-2 text-muted">→</span>
              </>
            )}
            <span className="font-semibold">{s.after}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
