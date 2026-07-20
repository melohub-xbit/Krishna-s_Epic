"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "@/components/fields/NebulaField";

const BASE = [
  { r: 1.0, sx: 0.30, sy: 0.50, tube: 0.02 },
  { r: 1.6, sx: -0.22, sy: 0.35, tube: 0.02 },
  { r: 2.3, sx: 0.25, sy: -0.30, tube: 0.018 },
  { r: 3.0, sx: -0.16, sy: 0.22, tube: 0.018 },
  { r: 3.8, sx: 0.12, sy: -0.18, tube: 0.016 },
  { r: 4.7, sx: -0.10, sy: 0.14, tube: 0.014 },
  { r: 5.7, sx: 0.08, sy: -0.11, tube: 0.012 },
];

const RING: Record<Theme, { colors: string[]; core: string; tubeMul: number; opacity: number }> = {
  day: { colors: ["#1a1712", "#1a1712", "#1a1712", "#a5262a", "#1a1712", "#1a1712", "#1a1712"], core: "#a5262a", tubeMul: 1.7, opacity: 0.26 },
  night: { colors: ["#e4dcc6", "#cfc8b4", "#e4dcc6", "#a5262a", "#cfc8b4", "#e4dcc6", "#b8b0a0"], core: "#efe4cb", tubeMul: 1.6, opacity: 0.85 },
  cosmic: { colors: ["#e6b34c", "#e0872e", "#5a8fd6", "#c9a24b", "#a5262a", "#e6b34c", "#5a8fd6"], core: "#ffe6b0", tubeMul: 1.0, opacity: 0.9 },
};

export default function RingField({ theme }: { theme: Theme }) {
  const conf = RING[theme];
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    BASE.forEach((rg, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.rotation.x = 0.6 + t * rg.sx * 0.25;
      m.rotation.y = t * rg.sy * 0.25;
    });
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color={conf.core} toneMapped={false} />
      </mesh>
      {BASE.map((rg, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={[0, 0, -i * 0.35]}>
          <torusGeometry args={[rg.r, rg.tube * conf.tubeMul, 12, 140]} />
          <meshBasicMaterial color={conf.colors[i]} toneMapped={false} transparent opacity={conf.opacity} />
        </mesh>
      ))}
    </group>
  );
}
