"use client";

import { useSyncExternalStore } from "react";

// Without a GPU, browsers draw WebGL on the CPU (SwiftShader, llvmpipe, Microsoft's Basic Render Driver),
// where a full-screen animated shader freezes the page for seconds. Lighthouse's emulated phone is one of these.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

// Creating the first WebGL context starts the renderer, which takes over a second without a GPU,
// so the check runs in a worker on an OffscreenCanvas and the page never waits for it
const WORKER_SOURCE = `
self.onmessage = () => {
  try {
    const canvas = new OffscreenCanvas(1, 1);
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return postMessage(null);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    postMessage(renderer);
  } catch {
    postMessage(null);
  }
};`;

// Fallback for browsers without WebGL in workers (older Safari); costs one context on the main thread
function rendererOnMainThread(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    // Free the probe's context right away; browsers cap how many can be open
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return renderer;
  } catch {
    return null;
  }
}

let result: boolean | null = null;
let started = false;
const listeners = new Set<() => void>();

function finish(renderer: string | null) {
  result = renderer !== null && !SOFTWARE_RENDERER.test(renderer);
  listeners.forEach((notify) => notify());
}

function start() {
  started = true;
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
    finish(rendererOnMainThread());
    return;
  }

  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(url);
  const done = (renderer: string | null) => {
    worker.terminate();
    URL.revokeObjectURL(url);
    // A worker that can't make a context (no OffscreenCanvas WebGL) answers null; check on the main thread instead
    finish(renderer ?? rendererOnMainThread());
  };
  worker.onmessage = (event: MessageEvent<string | null>) => done(event.data);
  worker.onerror = () => done(null);
  worker.postMessage(null);
}

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  if (!started) start();
  return () => listeners.delete(onChange);
};

// True when WebGL runs on a real GPU; null until the check finishes (and on the server)
export function useHardwareWebGL(): boolean | null {
  return useSyncExternalStore(subscribe, () => result, () => null);
}
