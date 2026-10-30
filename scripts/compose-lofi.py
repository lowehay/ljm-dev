"""Synthesize the original lo-fi chiptune loop in public/music/ (pure Python, no deps). Run: python3 scripts/compose-lofi.py public/music/lofi-loop.wav"""
import math
import random
import struct
import sys
import wave
from array import array

SR = 22050
BPM = 80
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 16
LOOP = BAR * BARS
TAIL = 3.0
N = int((LOOP + TAIL) * SR)
L = int(LOOP * SR)
random.seed(7)

buf = array("f", [0.0]) * N


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def tri(phase):
    p = phase % 1.0
    return 4 * p - 1 if p < 0.5 else 3 - 4 * p


def square(phase, duty=0.25):
    return 1.0 if phase % 1.0 < duty else -1.0


def add(start, length, gen):
    """Mix a generated sound into the buffer. gen(t) returns the sample at time t seconds into the note."""
    i0 = int(start * SR)
    for k in range(int(length * SR)):
        i = i0 + k
        if i >= N:
            break
        buf[i] += gen(k / SR)


# Fmaj7 - Em7 - Dm7 - Cmaj7, voiced around the middle of the keyboard
CHORDS = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
ROOTS = [41, 40, 38, 36]
SWING = BEAT * 0.09  # late off-beats give the lazy lo-fi feel


def pad(freq, length):
    def gen(t):
        attack = min(1.0, t / 0.45)
        release = min(1.0, max(0.0, (length - t) / 0.7))
        detune = 0.5 * (tri(freq * t) + tri(freq * 1.004 * t))
        return 0.05 * attack * release * detune
    return gen


def bass(freq):
    def gen(t):
        env = min(1.0, t / 0.01) * (0.55 + 0.45 * math.exp(-t / 0.35))
        return 0.17 * env * (0.7 * math.sin(2 * math.pi * freq * t) + 0.3 * tri(freq * t))
    return gen


def chip(freq, amp, tau):
    def gen(t):
        return amp * min(1.0, t / 0.004) * math.exp(-t / tau) * square(freq * t)
    return gen


def lead(freq):
    def gen(t):
        env = min(1.0, t / 0.02) * math.exp(-t / 0.5)
        vibrato = 1 + 0.004 * math.sin(2 * math.pi * 5 * t) * min(1.0, t / 0.3)
        return 0.06 * env * tri(freq * vibrato * t)
    return gen


def kick(t):
    f = 45 + 75 * math.exp(-t / 0.035)
    return 0.5 * math.exp(-t / 0.14) * math.sin(2 * math.pi * f * t)


def make_noise(tau, amp, tone=0.0, smooth=0.0, highpass=False):
    state = {"lp": 0.0}

    def gen(t):
        n = random.uniform(-1, 1)
        state["lp"] += (n - state["lp"]) * (1 - smooth)
        s = n - state["lp"] if highpass else state["lp"]
        body = tone * math.sin(2 * math.pi * 185 * t)
        return amp * math.exp(-t / tau) * (s + body)
    return gen


for bar in range(BARS):
    t0 = bar * BAR
    chord = CHORDS[bar % 4]

    for note in chord:
        add(t0, BAR + 0.6, pad(hz(note), BAR + 0.6))

    root = hz(ROOTS[bar % 4])
    add(t0, BEAT * 2, bass(root))
    add(t0 + BEAT * 2.5 + SWING, BEAT * 1.5, bass(root * 1.5 if bar % 2 else root))

    # Eighth-note chip arpeggio over the chord, an octave up
    order = [0, 1, 2, 3, 2, 1, 2, 3] if bar % 2 == 0 else [0, 2, 1, 3, 2, 3, 1, 2]
    for step, idx in enumerate(order):
        at = t0 + step * BEAT / 2 + (SWING if step % 2 else 0)
        accent = 0.045 if step % 2 == 0 else 0.03
        add(at, 0.4, chip(hz(chord[idx] + 12), accent, 0.16))

    # Drums: kick on 1 and the "and" of 3, snare on 2 and 4, swung hats
    if bar not in (0, 8):  # bars 1 and 9 breathe without the kick
        add(t0, 0.45, kick)
        add(t0 + BEAT * 2.5 + SWING, 0.45, kick)
    for beat in (1, 3):
        add(t0 + beat * BEAT, 0.3, make_noise(0.08, 0.16, tone=0.35, smooth=0.6))
    for step in range(8):
        at = t0 + step * BEAT / 2 + (SWING if step % 2 else 0)
        add(at, 0.08, make_noise(0.018, 0.05 if step % 2 == 0 else 0.03, smooth=0.5, highpass=True))

# A simple pentatonic melody over the second half (bars 9-16): (bar, beat, midi note, beats long)
MELODY = [
    (8, 0, 76, 1.5), (8, 1.5, 74, 0.5), (8, 2, 72, 2),
    (9, 0, 74, 1), (9, 1, 76, 1), (9, 2, 79, 2),
    (10, 0, 77, 1.5), (10, 1.5, 76, 0.5), (10, 2, 74, 2),
    (11, 0, 72, 1), (11, 1, 74, 1), (11, 2, 67, 2),
    (12, 0, 76, 1.5), (12, 1.5, 79, 0.5), (12, 2, 81, 2),
    (13, 0, 79, 1), (13, 1, 76, 1), (13, 2, 74, 2),
    (14, 0, 72, 1.5), (14, 1.5, 74, 0.5), (14, 2, 76, 2),
    (15, 0, 74, 2), (15, 2, 72, 2),
]
for bar, beat, note, beats in MELODY:
    add(bar * BAR + beat * BEAT, beats * BEAT + 0.6, lead(hz(note)))

# Vinyl: a faint noise floor plus sparse crackles
lp = 0.0
for i in range(N):
    lp += (random.uniform(-1, 1) - lp) * 0.08
    buf[i] += 0.006 * lp
for _ in range(int(LOOP * 12)):
    i = random.randrange(N - 200)
    amp = random.uniform(0.01, 0.05) * random.choice((-1, 1))
    for k in range(60):
        buf[i + k] += amp * math.exp(-k / 8)

# Wrap the tail into the start so the loop point is seamless
for k in range(N - L):
    buf[k] += buf[L + k]

# Warm low-pass, gentle tape-style saturation, then normalize
out = array("f", [0.0]) * L
# Warm the filter up on the end of the loop so its state already matches at the seam
lp = 0.0
for i in range(L - 4000, L):
    lp += (buf[i] - lp) * 0.55
for i in range(L):
    lp += (buf[i] - lp) * 0.55
    out[i] = math.tanh(lp * 1.4)
peak = max(abs(v) for v in out) or 1.0
scale = 0.89 / peak

path = sys.argv[1]
with wave.open(path, "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(v * scale * 32767)) for v in out))

rms = math.sqrt(sum(v * v for v in out) / L) * scale
print(f"wrote {path}: {LOOP:.1f}s loop, {SR} Hz mono, peak 0.89, rms {rms:.3f}")
