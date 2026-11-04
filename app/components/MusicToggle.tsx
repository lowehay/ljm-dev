"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import WakeSlider from "./WakeSlider/WakeSlider";

const DEFAULT_VOLUME = 35; // percent
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
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  // Read by the async playback callbacks, which would otherwise see a stale volume
  const volumeRef = useRef(DEFAULT_VOLUME);

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
        if (wantRef.current) fadeTo(player, volumeRef.current / 100);
      })
      .catch(() => {
        // The file is missing or can't be decoded
        wantRef.current = false;
        setFailed(true);
        setPlaying(false);
      });
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    volumeRef.current = next;
    const player = playerRef.current;
    if (!player || !wantRef.current) return;
    // Ease toward the new level so dragging doesn't crackle
    const now = player.ctx.currentTime;
    player.gain.gain.cancelScheduledValues(now);
    player.gain.gain.setTargetAtTime(next / 100, now, 0.05);
  };

  const label = failed ? "Music unavailable" : playing ? "Turn music off" : "Turn music on";

  return (
    // The volume panel opens on hover, or while the button or slider has keyboard focus
    <div className="group relative">
      <button
        type="button"
        onClick={toggle}
        disabled={failed}
        aria-label={label}
        aria-pressed={playing}
        className="p-2 text-muted hover:text-fg transition disabled:opacity-40 disabled:hover:text-muted"
      >
        {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {!failed && (
        // pt-2 bridges the gap so the panel stays open while the cursor moves down into it
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
          <div className="w-44 rounded-xl border border-line bg-surface/90 backdrop-blur-md px-3 pt-2 pb-1 shadow-lg">
            {/* Stands in for a tooltip: the panel opens on hover, so it says what the button does */}
            <p className="text-[11px] font-mono text-muted">{playing ? "Stop music" : "Play music"}</p>
            <WakeSlider
              value={volume}
              onChange={changeVolume}
              min={0}
              max={100}
              step={1}
              bars={16}
              height={26}
              restHeight={8}
              gap={3}
              fillColor="var(--color-fg)"
              trackColor="var(--color-line-strong)"
              showValue
              formatValue={(v) => `${v}%`}
              ariaLabel="Music volume"
              className="text-xs font-mono text-muted"
            />
          </div>
        </div>
      )}
    </div>
  );
}
