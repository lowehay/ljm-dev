"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Calculator,
  Clock,
  Code2,
  Copy,
  FileText,
  FolderGit2,
  Hash,
  Image as ImageIcon,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
  SunMoon,
} from "lucide-react";
import { site } from "../site";
import { projects } from "../data";
import { posts } from "../notes/posts";
import { toggleTheme } from "./useTheme";
import { setBackground, getBackground } from "./useBackground";
import { OPEN_ASK_EVENT, OPEN_PALETTE_EVENT } from "./events";

type Command = {
  id: string;
  label: string;
  group: "Go to" | "Actions" | "Links";
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
  run: () => void;
};


const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Tech stack" },
  { id: "notes", label: "Notes section" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

// Ctrl+K / ⌘K command palette: jump to sections, switch theme or background, copy the email, open links.
export default function CommandPalette({ askEnabled }: { askEnabled: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    // Sections live on the homepage; from another page, navigate there first
    const goTo = (id: string) => () => {
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
      } else {
        router.push(`/#${id}`);
      }
    };
    const list: Command[] = [
      ...SECTIONS.map((s) => ({ id: `go-${s.id}`, label: s.label, group: "Go to" as const, icon: Hash, run: goTo(s.id) })),
      ...projects
        .filter((p) => p.caseStudy)
        .map((p) => ({
          id: `case-${p.caseStudy}`,
          label: `${p.title} case study`,
          group: "Go to" as const,
          icon: FolderGit2,
          keywords: `project ${p.tech.join(" ")}`,
          run: () => router.push(p.caseStudy!),
        })),
      { id: "scope", label: "Scope your project", group: "Go to", icon: Calculator, keywords: "estimate timeline quote hire plan", run: () => router.push("/scope") },
      { id: "now", label: "Now", group: "Go to", icon: Clock, keywords: "currently working lately", run: () => router.push("/now") },
      { id: "notes", label: "Notes", group: "Go to", icon: NotebookPen, keywords: "blog writing articles", run: () => router.push("/notes") },
      ...posts.map((p) => ({
        id: `note-${p.slug}`,
        label: p.title,
        group: "Go to" as const,
        icon: NotebookPen,
        keywords: `note blog ${p.tags.join(" ")}`,
        run: () => router.push(`/notes/${p.slug}`),
      })),
      { id: "resume", label: "Résumé", group: "Go to", icon: FileText, keywords: "resume cv", run: () => router.push(site.resume) },
      ...(askEnabled
        ? [
            {
              id: "ask",
              label: "Ask about me (AI)",
              group: "Actions" as const,
              icon: Sparkles,
              keywords: "chat question ai gemini",
              run: () => window.dispatchEvent(new Event(OPEN_ASK_EVENT)),
            },
          ]
        : []),
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        keywords: "contact mail",
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setToast("Email copied");
          } catch {
            setToast(site.email);
          }
        },
      },
      { id: "email", label: "Send an email", group: "Actions", icon: Mail, keywords: "contact hire", run: () => (window.location.href = `mailto:${site.email}`) },
      { id: "theme", label: "Toggle light / dark theme", group: "Actions", icon: SunMoon, keywords: "mode color", run: toggleTheme },
      {
        id: "background",
        label: "Switch background",
        group: "Actions",
        icon: ImageIcon,
        keywords: "pixel gradient grain",
        run: () => setBackground(getBackground() === "grain" ? "pixel" : "grain"),
      },
      { id: "github", label: "GitHub profile", group: "Links", icon: Code2, run: () => window.open(site.github, "_blank", "noopener") },
      ...(site.linkedin
        ? [{ id: "linkedin", label: "LinkedIn", group: "Links" as const, icon: Briefcase, run: () => window.open(site.linkedin, "_blank", "noopener") }]
        : []),
    ];
    return list;
  }, [askEnabled, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  const show = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Keep the highlighted row in view while moving with the arrow keys
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    setOpen(false);
    command.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[15vh] bg-canvas/40 backdrop-blur-sm print:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onKeyDown={onKeyDown}
              className="w-full max-w-lg rounded-2xl border border-line bg-canvas/90 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 border-b border-line">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder="Type a command or search..."
                  aria-label="Search commands"
                  aria-controls="command-results"
                  aria-activedescendant={results[active] ? `command-${results[active].id}` : undefined}
                  className="flex-1 py-3.5 bg-transparent text-sm text-fg placeholder:text-muted outline-none"
                />
                <kbd className="text-[10px] font-mono text-muted border border-line rounded px-1.5 py-0.5">ESC</kbd>
              </div>

              <ul id="command-results" ref={listRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results</li>}
                {results.map((c, i) => {
                  const heading = c.group !== lastGroup ? c.group : null;
                  lastGroup = c.group;
                  const Icon = c.icon;
                  return (
                    <li key={c.id} role="presentation">
                      {heading && <p className="px-3 pt-2 pb-1 text-[11px] font-mono text-muted">{heading}</p>}
                      <button
                        type="button"
                        id={`command-${c.id}`}
                        role="option"
                        aria-selected={i === active}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => runCommand(c)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition ${
                          i === active ? "bg-surface text-fg" : "text-fg-soft"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-muted shrink-0" />
                        <span className="flex-1">{c.label}</span>
                        {c.group === "Links" && <ArrowUpRight className="w-3.5 h-3.5 text-muted" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] px-3 py-1.5 rounded-full bg-fg text-canvas text-xs font-mono shadow-lg"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
