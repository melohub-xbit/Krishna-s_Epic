"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, FIELD } from "@/lib/palette";

/**
 * The background field: a sikku-kolam lattice with a manga screentone grain over it.
 *
 * Deliberately FLAT and far back. It is a single plane parked behind everything,
 * scaled to fill the frustum, with no depth cues of its own -- the whole point is
 * that it reads as a wall/floor pattern rather than as objects floating in space.
 * Contrast is kept very low (see FIELD) so the chakra always wins the eye.
 *
 * Sikku kolam is drawn as continuous loops woven AROUND a grid of dots (pulli).
 * Approximated here with interlocking rings on the cell lattice, which is
 * genuinely how the woven loops resolve.
 */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;

  uniform vec3 uGroundCore;
  uniform vec3 uGroundMid;
  uniform vec3 uGroundEdge;

  uniform vec3 uKolamLine;
  uniform vec3 uKolamDot;
  uniform vec3 uTone;
  uniform vec3 uHatch;

  uniform float uKolamOpacity;
  uniform float uDotOpacity;
  uniform float uToneOpacity;
  uniform float uHatchOpacity;
  uniform float uKolamScale;
  uniform float uToneScale;

  // Anti-aliased band around a value, width in the same units as d.
  float band(float d, float w) {
    float aa = fwidth(d) * 1.2;
    return 1.0 - smoothstep(w - aa, w + aa, abs(d));
  }

  float disc(float d, float r) {
    float aa = fwidth(d) * 1.2;
    return 1.0 - smoothstep(r - aa, r + aa, d);
  }

  void main() {
    // Aspect-corrected coords so the lattice stays square on any viewport.
    vec2 p = vUv - 0.5;
    p.x *= uAspect;

    // ---- Ground: saffron heart falling off to kumkum shadow ----
    float r = length(p * vec2(0.86, 1.0));
    vec3 ground = mix(uGroundCore, uGroundMid, smoothstep(0.0, 0.42, r));
    ground = mix(ground, uGroundEdge, smoothstep(0.38, 0.92, r));

    vec3 col = ground;

    // ================= LAYER 1: sikku kolam lattice =================
    // Slow diagonal drift. Two lattices offset by half a cell interlock
    // into continuous woven loops, which is the sikku kolam read.
    vec2 kp = p * uKolamScale + vec2(uTime * 0.05, uTime * 0.05);

    vec2 cellA = fract(kp) - 0.5;
    vec2 cellB = fract(kp + 0.5) - 0.5;

    // Thin strokes. At the previous 0.028 the loops read as fat bubble
    // outlines; kolam is drawn with a fingertip trail of rice flour, so the
    // line should be hairline relative to the cell.
    float ringA = band(length(cellA) - 0.35, 0.012);
    float ringB = band(length(cellB) - 0.35, 0.012);
    float lattice = max(ringA, ringB);

    // Pulli: the dots the loops are drawn around, sitting at cell centres.
    float dots = disc(length(cellA), 0.030);

    // Fade the lattice out toward the centre so it never crowds the chakra,
    // and out at the far corners so the frame stays quiet.
    float centreClear = smoothstep(0.10, 0.40, r);
    float edgeFade = 1.0 - smoothstep(0.62, 1.0, r);
    float kolamMask = centreClear * edgeFade;

    col = mix(col, uKolamLine, lattice * uKolamOpacity * kolamMask);
    col = mix(col, uKolamDot, dots * uDotOpacity * kolamMask);

    // ================= LAYER 2: manga screentone =================
    // Halftone dots on their own slow drift, at a different rate to the
    // kolam so the two layers never lock together and read as one texture.
    vec2 tp = p * uToneScale + vec2(-uTime * 0.30, uTime * 0.30);
    vec2 tcell = fract(tp) - 0.5;
    // Dot size swells slightly toward the edges: classic screentone gradient.
    float toneR = mix(0.13, 0.30, smoothstep(0.15, 0.95, r));
    float halftone = disc(length(tcell), toneR);
    col = mix(col, uTone, halftone * uToneOpacity * edgeFade);

    // Speed-line hatching, rotated off-axis and very faint.
    float ang = 0.66;
    vec2 hp = vec2(p.x * cos(ang) - p.y * sin(ang), p.x * sin(ang) + p.y * cos(ang));
    float hatch = band(fract(hp * 46.0 + uTime * 0.02).y - 0.5, 0.10);
    col = mix(col, uHatch, hatch * uHatchOpacity * smoothstep(0.30, 0.95, r));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function KolamField() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uGroundCore: { value: new THREE.Color(PALETTE.groundCore) },
      uGroundMid: { value: new THREE.Color(PALETTE.groundMid) },
      uGroundEdge: { value: new THREE.Color(PALETTE.groundEdge) },
      uKolamLine: { value: new THREE.Color(PALETTE.kolamLine) },
      uKolamDot: { value: new THREE.Color(PALETTE.kolamDot) },
      uTone: { value: new THREE.Color(PALETTE.tone) },
      uHatch: { value: new THREE.Color(PALETTE.hatch) },
      uKolamOpacity: { value: FIELD.kolamOpacity },
      uDotOpacity: { value: FIELD.dotOpacity },
      uToneOpacity: { value: FIELD.toneOpacity },
      uHatchOpacity: { value: FIELD.hatchOpacity },
      uKolamScale: { value: FIELD.kolamScale },
      uToneScale: { value: FIELD.toneScale },
    }),
    []
  );

  // Park the plane well behind the chakra and size it to cover the frustum there.
  const Z = -9;
  const dist = (camera.position.z ?? 6) - Z;
  const fov = ((camera as THREE.PerspectiveCamera).fov ?? 50) * (Math.PI / 180);
  const h = 2 * Math.tan(fov / 2) * dist;
  const w = h * (viewport.width / viewport.height);

  useFrame((s) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime * FIELD.driftSpeed * 60;
      mat.current.uniforms.uAspect.value = viewport.width / viewport.height;
    }
  });

  return (
    <mesh position={[0, 0, Z]} frustumCulled={false}>
      <planeGeometry args={[w * 1.15, h * 1.15, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
