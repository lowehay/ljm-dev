"use client";

import { useSyncExternalStore } from "react";

export type Background = "pixel" | "grain";

const STORAGE_KEY = "background";
const DEFAULT: Background = "pixel";
const listeners = new Set<() => void>();

const read = (): Background => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "grain" ? "grain" : DEFAULT;
  } catch {
    return DEFAULT;
  }
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // Keep other open tabs in sync
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

export function setBackground(next: Background) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be blocked; the toggle then only lasts until the next reload
  }
  listeners.forEach((notify) => notify());
}

// The visitor's chosen animated background; null on the server until the client knows
export function useBackground(): Background | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
