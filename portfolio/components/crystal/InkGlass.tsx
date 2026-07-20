"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";

/**
 * FORM D -- ink-glass + the కృ seal.
 *
 * A convex ink-tinted lens floats in front of the chakra and refracts it. The
 * seal sits in front of the lens, so it reads as pressed into the glass with
 * the chakra burning behind.
 *
 * The lens is deliberately SMALLER than the chakra: the flame nimbus breaks
 * past its edge, so you get sharp fire outside and refracted, ink-darkened
 * metal inside. That contrast is the whole point of the form -- if the glass
 * covered everything it would just read as a filter over the scene.
 */

// Telugu needs a font with proper conjunct shaping -- కృ is క plus the ృ vattu,
// not two standalone glyphs. Swap this constant if the glyph renders wrong.
const TELUGU_FONT =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Bold.ttf";

// The lens sits close to the chakra on purpose. Pushed far forward it picks up
// heavy perspective magnification (camera z=6, so at z=1.55 it renders ~1.35x)
// and swallows the whole medallion.
const LENS_R = 1.05;
const LENS_Z = 1.15;
const SEAL_Z = 1.95;

export default function InkGlass() {
  const lens = useRef<THREE.Mesh>(null);
  const seal = useRef<THREE.Group>(null);

  // A flat disc, NOT a flattened sphere.
  //
  // The first attempt used a sphere squashed on Z. That gives near-perpendicular
  // curvature at the rim, which drives total internal reflection -- the lens
  // went fully mirror-like and occluded the chakra completely instead of
  // refracting it. A flat disc with a thin edge refracts cleanly and lets the
  // chakra read through.
  const lensGeo = useMemo(() => new THREE.CylinderGeometry(LENS_R, LENS_R, 0.16, 128), []);
  const sealRing = useMemo(() => new THREE.TorusGeometry(0.46, 0.018, 20, 96), []);
  const sealRingOuter = useMemo(() => new THREE.TorusGeometry(0.52, 0.009, 16, 96), []);

  const goldPale = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PALETTE.goldPale,
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1.5,
      }),
    []
  );

  // Very slight drift, counter to the chakra's spin, so the two layers
  // separate in depth rather than reading as one flat image.
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (lens.current) {
      lens.current.rotation.z = -t * 0.012;
      lens.current.position.y = Math.sin(t * 0.28) * 0.018;
    }
    if (seal.current) {
      seal.current.position.y = Math.sin(t * 0.28 + 0.6) * 0.03;
      seal.current.rotation.z = Math.sin(t * 0.19) * 0.02;
    }
  });

  return (
    <group>
      {/* ---- the ink-glass lens ---- */}
      <mesh
        ref={lens}
        geometry={lensGeo}
        position={[0, 0, LENS_Z]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <MeshTransmissionMaterial
          samples={8}
          resolution={768}
          transmission={1}
          // Thin. At 0.55 the attenuation ate the chakra entirely.
          thickness={0.14}
          roughness={0.05}
          // Gentle bend -- 1.52 was pushing past the critical angle at the rim.
          ior={1.28}
          chromaticAberration={0.05}
          anisotropy={0.06}
          distortion={0.06}
          distortionScale={0.22}
          temporalDistortion={0.03}
          // Reflections were drowning the refraction; the Lightformers were
          // blowing out across the whole face.
          envMapIntensity={0.22}
          color={PALETTE.inkGlass}
          attenuationColor={PALETTE.saffron}
          attenuationDistance={9.0}
        />
      </mesh>

      {/* ---- the seal, pressed in front of the glass ---- */}
      <group ref={seal} position={[0, 0, SEAL_Z]}>
        <mesh geometry={sealRing} material={goldPale} />
        <mesh geometry={sealRingOuter} material={goldPale} />
        <Text
          font={TELUGU_FONT}
          fontSize={0.52}
          color={PALETTE.goldPale}
          anchorX="center"
          anchorY="middle"
          position={[0, 0.02, 0.03]}
        >
          కృ
        </Text>
      </group>
    </group>
  );
}
