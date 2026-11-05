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

function SmoothScrollStopsHalfway() {
  return (
    <>
      <P>
        Aura Brew, my 3D coffee café site, has a navbar that jumps to each section with a smooth scroll. Most links
        worked. Then I noticed two things: sections landed with an empty band above them, and one link, &quot;Brew at
        home&quot;, sometimes stopped in the middle of the page and stayed there.
      </P>

      <H2>Problem one: an offset counted twice</H2>
      <P>
        Each section has a <C>scroll-margin-top</C> so its heading lands just under the fixed navbar. While working on the
        site I had also tried a page-wide <C>scroll-padding-top</C> on <C>html</C>, then removed it. The browser adds both
        together, and the development server kept serving the old stylesheet with the padding still in it. So every
        section landed about 100 pixels too low, but only in development, which is why my production build tests passed.
      </P>
      <P>
        The fix was to stop relying on the value being absent and set it explicitly, so the per-section margins are the
        only offset:
      </P>
      <Code label="globals.css">{`
html {
  /* The per-section scroll-margins do the offsetting, so nothing is added on top */
  scroll-padding-top: 0;
}
`}</Code>

      <H2>Problem two: the scroll that gave up</H2>
      <P>
        &quot;Brew at home&quot; only failed when I clicked it from higher up the page. The scroll would start, pass
        into the &quot;cherry to cup&quot; section, and stop there. That section is pinned: it stays on screen while you
        scroll through six steps, and the current step&apos;s paragraph opened while the others closed.
      </P>
      <P>
        To find the cause I removed sections one at a time and retried the click. With the pinned section gone, the
        scroll finished every time. The problem was the resizing. As the smooth scroll passed through, steps opened and
        closed, the content changed height, and Chrome abandoned the scroll instead of finishing it.
      </P>

      <H2>The fix: nothing resizes while you scroll</H2>
      <P>
        I kept the effect but changed the layout. The list of steps now has a fixed size, and the current step&apos;s text
        shows in one fixed-height panel below it, fading from one step to the next. The page height never changes during
        a scroll:
      </P>
      <Code label="Journey.tsx">{`
<div className="relative mt-5 h-28 sm:h-24" aria-live="polite">
  <AnimatePresence mode="wait" initial={false}>
    <motion.p key={active} className="absolute inset-x-0 top-0" /* fade in and out */>
      {STEPS[active].text}
    </motion.p>
  </AnimatePresence>
</div>
`}</Code>

      <H2>Result</H2>
      <P>
        I scripted a check that clicks every navbar link from different starting points and measures where each heading
        lands. All seven links now land with the heading just under the navbar, including &quot;Brew at home&quot;
        clicked from further up the page, where it used to stop.
      </P>
      <List
        items={[
          "If an anchor link lands in the wrong place, check scroll-padding on the page and scroll-margin on the target. They add up.",
          "Content that changes size during a smooth scroll can cancel it. Pinned and animated sections are the usual suspects.",
          "When the cause isn't obvious, remove sections until the bug disappears. It's faster than guessing.",
        ]}
      />
    </>
  );
}

function ShrinkingA3DModel() {
  return (
    <>
      <P>
        The star of Aura Brew is a 3D coffee bean that follows you down the page. The model I started with was an OBJ file
        of 11.5 MB, so the preloader spent most of its time on one bean. I wanted it under a megabyte without it looking
        any worse.
      </P>

      <H2>Converting and compressing</H2>
      <P>
        OBJ is a plain-text format, so it&apos;s large. I converted it to glTF, the standard format for 3D on the web, and
        then compressed it with Meshopt, which stores the geometry in a compact binary form the browser decodes quickly:
      </P>
      <Code label="Terminal">{`
npx obj2gltf -i bean.obj -o bean.glb
npx @gltf-transform/cli optimize bean.glb coffee-bean.glb --compress meshopt --no-simplify
`}</Code>
      <P>
        On the page, the loader needs to be told about Meshopt. With React Three Fiber&apos;s helpers that&apos;s one
        argument: <C>useGLTF(url, false, true)</C>.
      </P>

      <H2>The smaller version that looked wrong</H2>
      <P>
        My first attempt also simplified the mesh, removing most of its triangles, and recalculated the lighting normals.
        The file was tiny, but the bean looked smooth and plastic. The fine creases that make it read as a real bean came
        from the original normals, not from the number of triangles. So I kept every triangle and the original normals,
        and let compression do the work. That version came out at 871 KB.
      </P>
      <P>
        The simplified version did find a use. When you change the roast, a burst of small beans flies out, and at that
        size nobody sees the detail. That low-detail copy is 68 KB.
      </P>

      <H2>The bug compression introduced</H2>
      <P>
        The burst beans first rendered as jagged shards, like crystals. To save space, the compressed model stores positions
        as 16-bit integers instead of floats. I was baking the model&apos;s transform straight into that array, and
        writing scaled decimal values into integer storage scrambled the shape. Copying the positions out as floats first
        fixed it:
      </P>
      <Code label="Copy before transforming">{`
const pos = source.getAttribute("position");
const floats = new Float32Array(pos.count * 3);
for (let i = 0; i < pos.count; i++) {
  floats[i * 3] = pos.getX(i);     // getX() undoes the integer packing
  floats[i * 3 + 1] = pos.getY(i);
  floats[i * 3 + 2] = pos.getZ(i);
}
geometry.setAttribute("position", new THREE.BufferAttribute(floats, 3));
geometry.applyMatrix4(node.matrixWorld); // safe now
`}</Code>

      <H2>Result</H2>
      <Stats
        items={[
          { label: "Bean model", before: "11.5 MB", after: "871 KB" },
          { label: "Burst model", after: "68 KB" },
          { label: "Studio lighting map", after: "131 KB" },
        ]}
      />
      <P>
        I also self-hosted the studio lighting map at a smaller size, and the preloader now waits until the scene is
        actually ready, so the page never appears with the bean missing.
      </P>
      <List
        items={[
          "Compress first, simplify last. Fewer triangles saves bytes, but compression saves most of them without changing the look.",
          "Detail often lives in the normals. Recalculating them can cost more than removing triangles.",
          "Compressed geometry may not be stored as floats. Read it through the attribute's getters before modifying it.",
        ]}
      />
    </>
  );
}

export const bodies: Record<string, () => React.JSX.Element> = {
  "smooth-scroll-stops-halfway": SmoothScrollStopsHalfway,
  "shrinking-a-3d-model": ShrinkingA3DModel,
  "webgl-without-a-gpu": WebGLWithoutAGPU,
  "seamless-audio-loop": SeamlessAudioLoop,
};
