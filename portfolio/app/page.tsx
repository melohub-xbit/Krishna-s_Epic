"use client";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Brahmanda from "@/components/fields/Brahmanda";
import Crystal from "@/components/crystal/Crystal";
import Site from "@/components/foreground/Site";
import { PALETTE } from "@/lib/palette";

/**
 * One palette, always -- the day / night / cosmic switching is gone.
 *
 * The canvas is fixed and fills the viewport; the site document scrolls over
 * it, so the chakra persists across every section rather than scrolling away
 * as a hero image.
 */
export default function Page() {
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
          <Crystal />
          <EffectComposer>
            <Bloom intensity={0.22} luminanceThreshold={0.88} luminanceSmoothing={0.28} mipmapBlur />
            <Noise opacity={0.1} premultiply blendFunction={BlendFunction.OVERLAY} />
            <Vignette offset={0.24} darkness={0.82} />
          </EffectComposer>
        </Canvas>
      </div>
      <Site />
    </>
  );
}
