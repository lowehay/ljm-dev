// Turns the WAV from compose-lofi.py into the MP3 the site plays, padded so it loops without a gap:
// a quarter second of the loop's end goes before it and of its start after it, so MusicToggle can loop
// [0.25s, 0.25s + loop length] no matter how much encoder delay a browser's decoder leaves in.
// The encoder isn't a project dependency, so install it just for this run:
//   npm i --no-save @breezystack/lamejs && node scripts/encode-loop.mjs in.wav public/music/lofi-loop.mp3
import fs from "node:fs";
import { Mp3Encoder } from "@breezystack/lamejs";

const [input, output, kbps = "64"] = process.argv.slice(2);
const wav = fs.readFileSync(input);

// Read the format and samples from a 16-bit PCM WAV
let offset = 12;
let channels, rate, samples;
while (offset < wav.length) {
  const id = wav.toString("ascii", offset, offset + 4);
  const size = wav.readUInt32LE(offset + 4);
  if (id === "fmt ") {
    channels = wav.readUInt16LE(offset + 10);
    rate = wav.readUInt32LE(offset + 12);
  } else if (id === "data") {
    samples = new Int16Array(wav.buffer.slice(wav.byteOffset + offset + 8, wav.byteOffset + offset + 8 + size));
  }
  offset += 8 + size + (size & 1);
}
if (channels !== 1) throw new Error("Expected a mono WAV");

const pad = Math.round(rate * 0.25);
const padded = new Int16Array(samples.length + pad * 2);
padded.set(samples.subarray(samples.length - pad), 0);
padded.set(samples, pad);
padded.set(samples.subarray(0, pad), pad + samples.length);

const encoder = new Mp3Encoder(1, rate, Number(kbps));
const chunks = [];
for (let i = 0; i < padded.length; i += 1152) chunks.push(Buffer.from(encoder.encodeBuffer(padded.subarray(i, i + 1152))));
chunks.push(Buffer.from(encoder.flush()));
fs.writeFileSync(output, Buffer.concat(chunks));
console.log(`Wrote ${output}: loop is ${samples.length / rate}s (set LOOP_LENGTH in MusicToggle to match)`);
