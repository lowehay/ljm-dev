"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas text-xs font-mono font-medium hover:opacity-80 transition"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print / Save PDF</span>
    </button>
  );
}
