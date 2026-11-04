import { C, Code, H2, List, P, Stats } from "./Prose";

// The text of each note, keyed by slug (metadata is in ./posts.ts)

function WebGLWithoutAGPU() {
  return (
    <>
      <P>
        My portfolio has an animated background drawn with a WebGL shader, and the pill in the navbar is WebGL too. On my
        laptop it runs smoothly. Then I ran it through Google PageSpeed and the mobile score came back at 54, with a{" "}
        <strong className="text-fg">Total Blocking Time of 3.7 seconds</strong>. That means the page couldn&apos;t
        respond to a tap for almost four seconds while it loaded.
      </P>

      <H2>Why a fast page froze</H2>
      <P>
        PageSpeed tests in an emulated phone without a graphics card. When a browser has no GPU to use, it still runs
        WebGL, but in software (Chrome uses a renderer called SwiftShader) on the CPU. A full-screen shader that a GPU
        draws in a fraction of a millisecond takes the CPU much longer, every single frame, on the same thread that
        handles clicks and scrolling.
      </P>
      <P>
        It&apos;s not only a test problem. Real visitors hit the same path on virtual machines, some office PCs, and
        browsers with hardware acceleration turned off.
      </P>

      <H2>The fix that didn&apos;t work</H2>
      <P>
        My first idea was to start the background a little later, after the page had loaded. The score didn&apos;t move.
        The cost wasn&apos;t starting the animation, it was drawing every frame of it, so delaying it just moved the
        freeze. I reverted it.
      </P>

      <H2>The fix that did</H2>
      <P>
        Instead of making the animation cheaper, I skip it when it would run in software. WebGL can tell you which
        renderer it&apos;s using, and the software ones have recognizable names:
      </P>
      <Code label="useHardwareWebGL.ts">{`
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

const info = gl.getExtension("WEBGL_debug_renderer_info");
const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
const hardware = !SOFTWARE_RENDERER.test(renderer);
`}</Code>
      <P>
        Visitors on a software renderer get a static dot pattern instead of the shader, and the navbar falls back to a
        plain CSS pill. Everyone with a GPU sees exactly the same site as before.
      </P>

      <H2>The catch: checking was slow too</H2>
      <P>
        To read the renderer name you have to create a WebGL context, and without a GPU creating the first one takes
        around a second and a half, on the main thread. So the check itself was freezing the page.
      </P>
      <P>
        The fix was to run the check in a Web Worker, which has its own thread. Workers can create WebGL contexts on an{" "}
        <C>OffscreenCanvas</C>, so the probe happens in the background and posts the renderer name back. Browsers that
        can&apos;t do that (older Safari) fall back to checking on the main thread, where they always have a GPU anyway.
      </P>
      <Code label="Running the probe off the main thread">{`
self.onmessage = () => {
  const canvas = new OffscreenCanvas(1, 1);
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  // ...read the renderer name as above...
  gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the context right away
  postMessage(renderer);
};
`}</Code>

      <H2>Result</H2>
      <Stats
        items={[
          { label: "Mobile score", before: "54", after: "69" },
          { label: "Total Blocking Time", before: "3.7s", after: "0.9s" },
          { label: "Desktop score", after: "97" },
        ]}
      />
      <P>What I took from it:</P>
      <List
        items={[
          "Measure before and after each change. My first fix felt right and did nothing.",
          "Heavy visual effects need a plan for devices that can't run them, not just a smaller version.",
          "Even a quick feature check can be expensive. Run it where it can't block the page.",
        ]}
      />
    </>
  );
}

function SeamlessAudioLoop() {
  return (
    <>
      <P>
        My portfolio has an optional lo-fi music loop: 48 seconds written so the end flows straight back into the start.
        As a WAV file it looped perfectly but was far too big to ship. As an MP3 it was a few hundred kilobytes, and{" "}
        <C>{"<audio loop>"}</C> played it with a small, very noticeable gap every time it repeated.
      </P>

      <H2>Where the gap comes from</H2>
      <P>
        MP3 stores audio in fixed-size frames of 1,152 samples, and the encoder adds a little silence at the start of the
        file (the encoder delay) and pads the end to fill the last frame. My file had 1,105 samples of silence at the
        front. Some decoders trim that padding using information in the file, others don&apos;t, so you can&apos;t simply
        cut a fixed amount and trust every browser to agree.
      </P>
      <P>
        On top of that, <C>{"<audio loop>"}</C> isn&apos;t sample-accurate: the browser seeks back to the start when the
        file ends, and that seek is audible.
      </P>

      <H2>Step 1: loop with Web Audio instead</H2>
      <P>
        The Web Audio API decodes the whole file into memory, and its buffer source can loop any window of it with sample
        accuracy:
      </P>
      <Code label="MusicToggle.tsx">{`
const buffer = await audioContext.decodeAudioData(await response.arrayBuffer());
const source = audioContext.createBufferSource();
source.buffer = buffer;
source.loop = true;
source.loopStart = LOOP_START;               // 0.25s
source.loopEnd = LOOP_START + LOOP_LENGTH;   // 0.25s + 48s
`}</Code>
      <P>
        That removes the seek, but it raises a question: where exactly does the music start in the decoded audio, if
        different browsers leave different amounts of padding at the front?
      </P>

      <H2>Step 2: pad the loop with itself</H2>
      <P>
        Before encoding, I put the last quarter second of the loop in front of it, and the first quarter second after
        it. Then the player loops the window from 0.25s to 48.25s.
      </P>
      <Code label="scripts/encode-loop.mjs">{`
const pad = Math.round(rate * 0.25);
const padded = new Int16Array(samples.length + pad * 2);
padded.set(samples.subarray(samples.length - pad), 0); // end of the loop, before it
padded.set(samples, pad);                               // the loop itself
padded.set(samples.subarray(0, pad), pad + samples.length); // start of the loop, after it
`}</Code>
      <P>
        If a browser leaves the encoder delay in, everything shifts by a few hundredths of a second, but both loop points
        shift by the same amount. Because the audio around each point is just more of the loop, the window is still
        exactly one full, continuous loop, and the jump from end to start lands on matching sound. Any padding up to a
        quarter second is absorbed.
      </P>

      <H2>Checking it</H2>
      <P>
        I didn&apos;t want to trust my ears alone, so I decoded the file in Chrome and compared the audio just before the
        loop end with the audio just after the loop start. They lined up. That check also caught a one-sample mismatch
        between two versions of the file, which I fixed by shipping the exact output of the encoding script.
      </P>
      <List
        items={[
          "Gapless MP3 looping needs both a sample-accurate player (Web Audio) and a file that tolerates decoder differences.",
          "Padding the loop with its own audio is simpler and more reliable than calculating each browser's offset.",
          <>
            The script lives in the repo, so the next track goes through the same steps: <C>node scripts/encode-loop.mjs</C>.
          </>,
        ]}
      />
    </>
  );
}

export const bodies: Record<string, () => React.JSX.Element> = {
  "webgl-without-a-gpu": WebGLWithoutAGPU,
  "seamless-audio-loop": SeamlessAudioLoop,
};
