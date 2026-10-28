"use client";

import React from "react";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="pt-8 border-t border-neutral-800 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          04 — Contact
        </h2>
        <h3 className="text-xl font-bold text-white">Let&apos;s build something great together.</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          For freelance inquiries, full-stack collabs, or general questions, feel free to reach out directly via email.
        </p>
      </div>

      <a
        href="mailto:louiejaemaravillosa24@gmail.com"
        className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition group"
      >
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-mono text-neutral-200">louiejaemaravillosa24@gmail.com</span>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
      </a>

      <div className="flex items-center justify-between pt-6 text-xs text-neutral-500 font-mono">
        <span>© 2026 Louie Jae Maravillosa</span>
      </div>
    </footer>
  );
}