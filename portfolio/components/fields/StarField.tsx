"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "@/components/fields/NebulaField";

const vert = `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixel;
varying vec3 vColor;
varying float vTw;
void main(){
  vColor = aColor;
  float tw = 0.5 + 0.5 * sin(uTime * 2.2 + aPhase * 6.2831);
  vTw = tw;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixel * (0.55 + 0.85 * tw) * (26.0 / -mv.z);
}`;

const frag = `
varying vec3 vColor;
varying float vTw;
uniform float uOpacity;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = smoothstep(0.5, 0.0, d);
  float glow = smoothstep(0.5, 0.12, d) * 0.5;
  float a = (core + glow) * uOpacity * (0.3 + 0.85 * vTw);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

const STAR: Record<Theme, { blend: THREE.Blending; palette: string[]; dark: boolean }> = {
  day: { blend: THREE.NormalBlending, dark: true, palette: ["#1a1712", "#141210", "#2a2724", "#a5262a", "#6b5b3a"] },
  night: { blend: THREE.NormalBlending, dark: false, palette: ["#efe4cb", "#cfc8b4", "#d8d0bc", "#a5262a", "#8a8272"] },
  cosmic: { blend: THREE.AdditiveBlending, dark: false, palette: ["#ffe6b0", "#e6b34c", "#8fbdf0", "#e0872e", "#c94b7a"] },
};

export default function StarField({ theme }: { theme: Theme }) {
  const conf = STAR[theme];
  const N = theme === "day" ? 2600 : 3400;
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ptr = useMemo(() => new THREE.Vector3(), []);
  const dpr = useThree((s) => s.viewport.dpr);

  const { base, geo } = useMemo(() => {
    const base = new Float32Array(N * 3);
    const pos = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);
    const cols = conf.palette.map((c) => new THREE.Color(c));
    for (let i = 0; i < N; i++) {
      const r = 2 + Math.random() * 2.8;
      const th = Math.acos(2 * Math.random() - 1);
      const ph = Math.random() * Math.PI * 2;
      const x = r * Math.sin(th) * Math.cos(ph);
      const y = r * Math.sin(th) * Math.sin(ph) * 0.72;
      const z = r * Math.cos(th);
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      const bright = Math.random();
      const idx = conf.dark
        ? (bright < 0.8 ? Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 2))
        : Math.floor(Math.random() * cols.length);
      const c = cols[idx];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      sizes[i] = 0.5 + Math.pow(Math.random(), 3) * 2.4;
      phases[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return { base, geo };
  }, [N, conf]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixel: { value: Math.min(dpr, 2) },
    uOpacity: { value: 0.95 },
  }), [dpr]);

  useFrame((s, dt) => {
    const arr = geo.attributes.position.array as Float32Array;
    ptr.set(s.pointer.x * 4.2, s.pointer.y * 3.0, 0);
    const k = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const bx = base[ix], by = base[ix + 1], bz = base[ix + 2];
      let x = arr[ix], y = arr[ix + 1], z = arr[ix + 2];
      const dx = x - ptr.x, dy = y - ptr.y, dz = z - ptr.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      let fx = 0, fy = 0, fz = 0;
      if (d2 < 2.4) {
        const inv = 1 / Math.sqrt(d2 + 0.001);
        const f = (2.4 - d2) * 0.7;
        fx = dx * inv * f; fy = dy * inv * f; fz = dz * inv * f;
      }
      x += (bx - x) * 0.05 + fx * k * 6;
      y += (by - y) * 0.05 + fy * k * 6;
      z += (bz - z) * 0.05 + fz * k * 6;
      arr[ix] = x; arr[ix + 1] = y; arr[ix + 2] = z;
    }
    geo.attributes.position.needsUpdate = true;
    if (matRef.current) matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
    if (pointsRef.current) pointsRef.current.rotation.y = s.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <shaderMaterial ref={matRef} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={conf.blend} />
    </points>
  );
}
