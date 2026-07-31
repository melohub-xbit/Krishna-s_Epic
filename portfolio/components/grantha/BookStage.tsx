"use client";

/**
 * THE STAGE — the r3f canvas layer plus the book, plus (on the site root) the
 * landing sequence in front of it.
 *
 * Every route that shows the volume mounts this: `/` (with the landing),
 * `/[slug]` (a deep link, no landing) and the `/grantha` workbench. Extracted so
 * those three cannot drift apart — the canvas rig, its post-processing chain and
 * the book must be identical or a bug at one route is unreproducible at another.
 *
 * The canvas is FIXED and behind everything, which is the point (§03.5): the
 * chakra is the one thing that must not move when a page turns. That is also why
 * the book is DOM + one WebGL leaf over a separate fixed canvas rather than one
 * r3f scene containing everything.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import Brahmanda from "@/components/fields/Brahmanda";
import Crystal from "@/components/crystal/Crystal";
import Grantha from "@/components/grantha/Grantha";
import LandingSequence from "@/components/ink/LandingSequence";
import { PALETTE } from "@/lib/palette";

/** Session key, so returning to the cover mid-visit doesn't re-run the writing. */
const SEEN = "ks.landing.seen";

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN) === "1";
  } catch {
    // Private mode / storage disabled. Playing the landing again is a far better
    // failure than throwing on first paint.
    return false;
  }
}

export interface BookStageProps {
  /** Spread to open on. Set by `/[slug]`; 0 (the cover) everywhere else. */
  initialPage?: number;
  /** Play the landing sequence first. Only the site root does. */
  landing?: boolean;
  /** Write the URL on every turn. False on the workbench route. */
  syncUrl?: boolean;
}

export default function BookStage({
  initialPage = 0,
  landing = false,
  syncUrl = false,
}: BookStageProps) {
  // The chakra's per-page keys, lifted here because the canvas is a SIBLING of the
  // book rather than inside it — which is the whole point of the layout, and also
  // why these have to travel up out of the book. Defaults are the cover's: the
  // wheel's own page. Values live in data/spreads.ts.
  const [chakra, setChakra] = useState({ spin: 1, scale: 1 });

  // Starts false on BOTH server and client and is raised in an effect. Reading
  // sessionStorage during render would make the server emit "no veil" and the
  // client hydrate with one — a mismatch, and the same class of bug as measuring
  // the viewport during render (see CurlVolume's `size`).
  const [veil, setVeil] = useState(false);
  const [out, setOut] = useState(false);
  const veilRef = useRef(false);
  veilRef.current = veil;

  useEffect(() => {
    if (landing && !alreadySeen()) setVeil(true);
  }, [landing]);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* nothing to do — worst case it plays again next visit */
    }
    // Fade the veil, then unmount it. Unmounting on the same frame would cut the
    // paper field to the book with no hand-off at all, which is the one thing
    // beat 3.4 exists to avoid.
    setOut(true);
    window.setTimeout(() => setVeil(false), 520);
  }, []);

  // Skippable on ANY input (§03.1). Capture phase, because the veil sits over
  // the book and the book's own Observer is paused while it is up.
  useEffect(() => {
    if (!veil) return;
    const skip = () => {
      if (veilRef.current) finish();
    };
    const opts = { capture: true } as const;
    window.addEventListener("keydown", skip, opts);
    window.addEventListener("pointerdown", skip, opts);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);
    return () => {
      window.removeEventListener("keydown", skip, opts);
      window.removeEventListener("pointerdown", skip, opts);
      window.removeEventListener("wheel", skip, opts);
      window.removeEventListener("touchstart", skip, opts);
    };
  }, [veil, finish]);

  return (
    <>
      <div className="wrap">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.8]}
          style={{ position: "absolute", inset: 0 }}
        >
          <color attach="background" args={[PALETTE.groundEdge]} />
          <fog attach="fog" args={[PALETTE.fog, 9, 26]} />
          <Brahmanda />
          <Crystal spin={chakra.spin} pageScale={chakra.scale} />
          <EffectComposer>
            <Bloom intensity={0.22} luminanceThreshold={0.88} luminanceSmoothing={0.28} mipmapBlur />
            <Noise opacity={0.1} premultiply blendFunction={BlendFunction.OVERLAY} />
            <Vignette offset={0.24} darkness={0.82} />
          </EffectComposer>
        </Canvas>
      </div>

      <Grantha
        initialPage={initialPage}
        syncUrl={syncUrl}
        paused={veil}
        onChakra={setChakra}
      />

      {/* Beat 3.4's hand-off is not built (the name does not yet shrink into the
          title panel and the chakra does not rise). This is the honest interim:
          the landing plays on its own paper field and dissolves to reveal the
          book already at page one. Roadmap Phase 3. */}
      {veil && (
        <div className="landing-veil" data-out={out ? "1" : undefined}>
          <LandingSequence onDone={finish} />
        </div>
      )}
    </>
  );
}
