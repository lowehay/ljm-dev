"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-neutral-800/50 py-4 mb-8">
      <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-white hover:opacity-80 transition">
          LJM<span className="text-neutral-500">.dev</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-neutral-400">
          <a href="#projects" className="hover:text-white transition">Projects</a>
          <a href="#experience" className="hover:text-white transition">Experience</a>
          <a href="#stack" className="hover:text-white transition">Stack</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 text-neutral-400 hover:text-white transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="sm:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-800/80 px-6 py-4 flex flex-col gap-4 text-sm text-neutral-300 shadow-2xl">
          <a href="#projects" onClick={handleNavClick} className="hover:text-white transition py-1">Projects</a>
          <a href="#experience" onClick={handleNavClick} className="hover:text-white transition py-1">Experience</a>
          <a href="#stack" onClick={handleNavClick} className="hover:text-white transition py-1">Stack</a>
          <a href="#contact" onClick={handleNavClick} className="hover:text-white transition py-1">Contact</a>
        </nav>
      )}
    </header>
  );
}