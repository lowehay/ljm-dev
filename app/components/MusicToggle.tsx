"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VOLUME = 0.35;
const FADE_S = 0.8;

// The MP3 holds the loop with a quarter second of its own end before it and its start after it
// (scripts/encode-loop.mjs), so this window loops seamlessly whatever padding the browser's decoder adds
const LOOP_START = 0.25;
const LOOP_LENGTH = 48;

type Player = { ctx: AudioContext; gain: GainNode; ready: Promise<void> };

// Background music the visitor turns on themselves (browsers block audio that starts on its own).
// It plays through Web Audio, which loops without the gap an <audio loop> leaves in an MP3,
// fades in and out instead of cutting, and isn't downloaded until the first click.
export default function MusicToggle({ src }: { src: string }) {
  const playerRef = useRef<Player | null>(null);
  // What the visitor last asked for; loading and resuming are async, so this can change before they finish
  const wantRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Stop the music if the navbar unmounts
  useEffect(() => () => void playerRef.current?.ctx.close(), []);

  const createPlayer = (): Player => {
    // The context is created inside the click so browsers allow it to make sound
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);

    const ready = fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Music request failed: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = LOOP_START;
        source.loopEnd = LOOP_START + LOOP_LENGTH;
        source.connect(gain);
        source.start(0, LOOP_START);
      });

    return { ctx, gain, ready };
  };

  const fadeTo = ({ ctx, gain }: Player, target: number) => {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + FADE_S);
  };

  const toggle = () => {
    const player = (playerRef.current ??= createPlayer());

    if (wantRef.current) {
      wantRef.current = false;
      setPlaying(false);
      fadeTo(player, 0);
      // Suspend after the fade so the page isn't keeping the audio device busy, unless it was turned back on
      setTimeout(() => {
        if (!wantRef.current) void player.ctx.suspend();
      }, FADE_S * 1000);
      return;
    }

    wantRef.current = true;
    setPlaying(true);
    Promise.all([player.ready, player.ctx.resume()])
      .then(() => {
        // Only fade in if the visitor hasn't turned it back off while the track was loading
        if (wantRef.current) fadeTo(player, VOLUME);
      })
      .catch(() => {
        // The file is missing or can't be decoded
        wantRef.current = false;
        setFailed(true);
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
