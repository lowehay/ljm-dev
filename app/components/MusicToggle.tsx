"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VOLUME = 0.35;
const FADE_MS = 800;

// Background music the visitor turns on themselves (browsers block audio that starts on its own).
// The track loops, fades in and out instead of cutting, and isn't downloaded until the first click.
export default function MusicToggle({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef(0);
  // What the visitor last asked for; play() resolves asynchronously, so this can change before it does
  const wantRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Stop the music if the navbar unmounts
  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current);
      audioRef.current?.pause();
    },
    []
  );

  const fadeTo = (audio: HTMLAudioElement, target: number, done?: () => void) => {
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      // The first frame's timestamp can be slightly earlier than `start`, so clamp both progress and volume
      const t = Math.min(1, Math.max(0, (now - start) / FADE_MS));
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * t));
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const toggle = () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      // The file is missing or can't be decoded
      audio.addEventListener("error", () => {
        wantRef.current = false;
        setFailed(true);
        setPlaying(false);
      });
      audioRef.current = audio;
    }
    const track = audio;

    if (wantRef.current) {
      wantRef.current = false;
      setPlaying(false);
      fadeTo(track, 0, () => track.pause());
      return;
    }

    wantRef.current = true;
    setPlaying(true);
    track
      .play()
      .then(() => {
        // Only fade in if the visitor hasn't turned it back off while the track was loading
        if (wantRef.current) fadeTo(track, VOLUME);
      })
      .catch((error: DOMException) => {
        // Pausing before playback starts aborts the request; that's not a failure
        if (error.name === "AbortError") return;
        wantRef.current = false;
        setPlaying(false);
      });
  };

  const label = failed ? "Music unavailable" : playing ? "Turn music off" : "Turn music on";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={failed}
      aria-label={label}
      aria-pressed={playing}
      title={label}
      className="p-2 text-muted hover:text-fg transition disabled:opacity-40 disabled:hover:text-muted"
    >
      {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}
