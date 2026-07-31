"use client";
import { useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import ChakraSculpt from "@/components/crystal/ChakraSculpt";
// Kept for Form D, currently not rendered -- see below.
// import InkGlass from "@/components/crystal/InkGlass";

/**
 * Lighting rig. Warmed to sit in the saffron/kumkum ground rather than against
 * a black void -- the old cool blue fill read as moonlight and fought the
 * festive palette. Kept a single cool rim for edge separation only.
 */
export default function Crystal({
  spin = 1,
  pageScale = 1,
}: {
  /** Per-page chakra keys from data/spreads.ts, forwarded to the sculpt. */
  spin?: number;
  pageScale?: number;
} = {}) {
  // BOTH, and they are not interchangeable: `size` is CSS pixels (used to
  // decide the breakpoint, so it matches the media query), `viewport` is
  // three.js world units (used to place the chakra, which lives in world
  // space). Swapping one for the other silently breaks the other use.
  const { size, viewport } = useThree();

  // Composition: anchor the chakra RIGHT and let it bleed off the viewport
  // edge, leaving a clean left column for type. Below 900px (matching the CSS
  // breakpoint) it recentres and the type takes the full width instead --
  // otherwise the two fight over a narrow screen.
  //
  // [REVISED 2026-07-20] This tested `viewport.width < 7.4` -- three.js WORLD
  // units, not pixels. World width is a function of ASPECT RATIO, so the test
  // was really `aspect < 1.32`, which does not track the CSS pixel breakpoint
  // it claims to match. A short landscape window (e.g. 880x600) is narrow to
  // the CSS at 900px but wide to the old test at aspect 1.47: the type went
  // full-width while the chakra stayed anchored right, and they collided --
  // exactly the fight this logic exists to prevent. `size` is in CSS pixels,
  // so it matches the media query by construction. Change both together.
  const narrow = size.width < 900;
  const offsetX = narrow ? 0 : viewport.width * 0.26;
  const scale = narrow ? 0.62 : 0.82;

  return (
    <group>
      <ambientLight intensity={0.22} color="#ffd2a0" />

      {/* warm key, upper right -- pulled back, it was blowing out the rim */}
      <directionalLight position={[4, 5, 6]} intensity={1.15} color="#ffe6bc" />
      {/* saffron fill from the left */}
      <directionalLight position={[-2, 4, -5]} intensity={0.85} color="#ffc887" />
      {/* faint cool rim, purely for edge definition */}
      <directionalLight position={[-5, -2, 3]} intensity={0.3} color="#c9b6ff" />
      {/* kumkum bounce from below, so recesses go warm-dark not grey */}
      <pointLight position={[0, -1.5, 3]} intensity={0.4} color="#d9564a" decay={0} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.6} position={[3, 3, 4]} scale={[7, 7, 1]} color="#ffdda6" />
        <Lightformer intensity={0.7} position={[-4, 1, 3]} scale={[7, 7, 1]} color="#ffb877" />
        <Lightformer intensity={0.5} position={[0, -4, 3]} scale={[9, 9, 1]} color="#e08a5a" />
        <Lightformer form="ring" intensity={0.9} position={[0, 0, -6]} scale={9} color="#e0872e" />
      </Environment>

      <group position={[offsetX, narrow ? 0.9 : 0, 0]}>
        <ChakraSculpt scale={scale} spin={spin} pageScale={pageScale} />
      </group>

      {/*
        Form D (ink-glass lens + కృ seal) is BUILT AND KEPT, but deliberately
        not rendered on the site. See components/crystal/InkGlass.tsx --
        the design is finished; re-enable by uncommenting.
      */}
      {/* <InkGlass /> */}
    </group>
  );
}
