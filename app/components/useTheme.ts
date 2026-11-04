"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

// The data-theme attribute on <html> is the source of truth (set early by the script in layout.tsx)
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
// Unknown on the server; settles on the first client render
const getServerTheme = () => null;

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}

// Flips the theme and remembers it; used by the theme button and the command palette
export function toggleTheme() {
  const next: Theme = getTheme() === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be blocked; the theme still applies for this visit
  }
}
