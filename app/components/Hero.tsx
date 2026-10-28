"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -999, y: -999 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="pt-2 pb-0">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-8 sm:gap-12">
        {/* Left Side: Soft Magnetic Spotlight */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePosition({ x: -999, y: -999 });
          }}
          className="w-56 sm:w-64 shrink-0 flex justify-center"
        >
          <div className="relative group w-full h-64 sm:h-72 overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-800/80 cursor-pointer">
            
            {/* Base Layer: Real Photo (Full size, perfectly aligned to match the container dimensions) */}
            <div className="absolute inset-0">
              <Image
                src="/avatar-real.png"
                alt="Louie Jae Maravillosa Real Photo"
                fill
                sizes="(max-width: 768px) 224px, 256px"
                className="object-contain object-center"
                priority
              />
            </div>

            {/* Top Layer: Pixel Art Avatar (Full card coverage, masked out by cursor spotlight) */}
            <div
              className="absolute inset-0 transition-opacity duration-150"
              style={{
                opacity: isHovered ? 1 : 1,
                WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.3) 75%, black 100%)`,
                maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.3) 75%, black 100%)`,
              }}
            >
              <Image
                src="/avatar-pixel.png"
                alt="Louie Jae Maravillosa Pixel Avatar"
                fill
                sizes="(max-width: 768px) 224px, 256px"
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Side: Headline, Balanced Bio & Links */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Louie Jae Maravillosa
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Full-Stack Developer focused on engineering enterprise web applications, conducting data analysis, and managing production deployments.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Passionate about turning rough ideas into high-performing, reliable software solutions that people actually use.
            </p>
          </div>

          {/* Minimalist Text Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs font-mono text-neutral-400">
            <a
              href="https://github.com/lowehay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition group"
            >
              <span>github</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="mailto:louiejaemaravillosa24@gmail.com"
              className="flex items-center gap-1 hover:text-white transition group"
            >
              <span>email</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              className="flex items-center gap-1 text-white font-medium hover:text-neutral-300 transition group"
            >
              <span>freelance</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}