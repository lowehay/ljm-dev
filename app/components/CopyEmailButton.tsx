"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); fall back to the mail app
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-line hover:border-line-strong text-xs font-mono text-muted hover:text-fg transition"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
