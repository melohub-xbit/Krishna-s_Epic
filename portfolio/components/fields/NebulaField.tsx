"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type Theme = "day" | "night" | "cosmic";

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const frag = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScale;
uniform float uSpeed;
uniform float uAlpha;
uniform vec3 uColorA;
uniform vec3 uColorB;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0,0.0)), c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
void main(){
  vec2 p = vUv * uScale + uMouse * 0.4;
  p += uTime * uSpeed * vec2(1.0, 0.6);
  float n = fbm(p);
  float n2 = fbm(p*2.0 + n*1.6 + uTime*uSpeed*0.4);
  float density = smoothstep(0.30, 0.95, n*0.55 + n2*0.6);
  float flash = 0.68 + 0.32 * sin(uTime*0.7 + n*6.2831);
  density *= flash;
  float edge = smoothstep(0.0, 0.34, min(min(vUv.x, 1.0-vUv.x), min(vUv.y, 1.0-vUv.y)));
  density *= edge;
  vec3 col = mix(uColorA, uColorB, clamp(n2, 0.0, 1.0));
  gl_FragColor = vec4(col, density * uAlpha);
}`;

type LayerCfg = { z: number; scale: number; speed: number; alpha: number; a: string; b: string };
const NEB: Record<Theme, { blend: THREE.Blending; layers: LayerCfg[] }> = {
  day: {
    blend: THREE.NormalBlending,
    layers: [
      { z: -6, scale: 2.2, speed: 0.02, alpha: 0.6, a: "#1a1712", b: "#3a332c" },
      { z: -3.5, scale: 3.4, speed: 0.035, alpha: 0.42, a: "#141210", b: "#5a1c1c" },
      { z: -1.4, scale: 5.2, speed: 0.05, alpha: 0.24, a: "#2a2724", b: "#a5262a" },
    ],
  },
  night: {
    blend: THREE.NormalBlending,
    layers: [
      { z: -6, scale: 2.2, speed: 0.02, alpha: 0.42, a: "#cfc8b4", b: "#8a8474" },
      { z: -3.5, scale: 3.4, speed: 0.035, alpha: 0.32, a: "#b8b0a0", b: "#6a5f52" },
      { z: -1.4, scale: 5.2, speed: 0.05, alpha: 0.2, a: "#d8d0bc", b: "#a5262a" },
    ],
  },
  cosmic: {
    blend: THREE.AdditiveBlending,
    layers: [
      { z: -6, scale: 2.2, speed: 0.02, alpha: 0.5, a: "#3a2a6a", b: "#e0872e" },
      { z: -3.5, scale: 3.4, speed: 0.035, alpha: 0.4, a: "#5a8fd6", b: "#c94b7a" },
      { z: -1.4, scale: 5.2, speed: 0.05, alpha: 0.28, a: "#7a4fd0", b: "#e6b34c" },
    ],
  },
};

function Layer({ cfg, blend }: { cfg: LayerCfg; blend: THREE.Blending }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uScale: { value: cfg.scale },
    uSpeed: { value: cfg.speed },
    uAlpha: { value: cfg.alpha },
    uColorA: { value: new THREE.Color(cfg.a) },
    uColorB: { value: new THREE.Color(cfg.b) },
  }), [cfg]);
  useFrame((s) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uMouse.value.set(s.pointer.x, s.pointer.y);
    }
  });
  return (
    <mesh position={[0, 0, cfg.z]}>
      <planeGeometry args={[36, 22, 1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={blend} />
    </mesh>
  );
}

export default function NebulaField({ theme }: { theme: Theme }) {
  const conf = NEB[theme];
  return (
    <group>
      {conf.layers.map((cfg, i) => (
        <Layer key={i} cfg={cfg} blend={conf.blend} />
      ))}
    </group>
  );
}
