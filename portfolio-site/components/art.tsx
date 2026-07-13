import React from "react";

const artLine = { stroke: "var(--art-line)", fill: "none" } as const;
const artGoldS = { stroke: "var(--art-gold)", fill: "none" } as const;

export function Chakra({ size = 220, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="70" style={{ ...artLine }} strokeWidth={4} />
      <circle cx="100" cy="100" r="52" style={{ ...artGoldS }} strokeWidth={3} />
      <circle cx="100" cy="100" r="20" style={{ fill: "var(--art-gold)", stroke: "var(--art-line)" }} strokeWidth={3} />
      <circle cx="100" cy="100" r="8" style={{ fill: "var(--accent)" }} />
      <g style={{ stroke: "var(--art-gold)", fill: "none" }} strokeWidth={6} strokeLinecap="round">
        <line x1="100" y1="30" x2="100" y2="70" />
        <line x1="100" y1="130" x2="100" y2="170" />
        <line x1="30" y1="100" x2="70" y2="100" />
        <line x1="130" y1="100" x2="170" y2="100" />
        <line x1="50" y1="50" x2="78" y2="78" />
        <line x1="122" y1="122" x2="150" y2="150" />
        <line x1="150" y1="50" x2="122" y2="78" />
        <line x1="50" y1="150" x2="78" y2="122" />
      </g>
      <g style={{ fill: "var(--art-line)" }}>
        <polygon points="100,18 106,32 94,32" />
        <polygon points="182,100 168,106 168,94" />
        <polygon points="100,182 94,168 106,168" />
        <polygon points="18,100 32,94 32,106" />
      </g>
    </svg>
  );
}

export function Bow({ size = 150, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" strokeLinecap="round" className={className} aria-hidden>
      <path d="M45 20 Q118 75 45 130" style={{ ...artGoldS }} strokeWidth={6} />
      <line x1="45" y1="20" x2="45" y2="130" style={{ stroke: "var(--art-line)" }} strokeWidth={2.5} />
      <line x1="45" y1="75" x2="120" y2="75" style={{ stroke: "var(--art-line)" }} strokeWidth={3} />
      <polygon points="120,75 108,69 108,81" style={{ fill: "var(--art-line)" }} />
      <line x1="30" y1="75" x2="45" y2="75" style={{ stroke: "var(--art-line)" }} strokeWidth={3} />
    </svg>
  );
}

export function Conch({ size = 150, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" strokeLinecap="round" className={className} aria-hidden>
      <path
        d="M95 30 Q60 40 52 70 Q46 100 70 118 Q95 132 112 110 Q92 108 86 92 Q104 96 108 82 Q88 82 84 68 Q100 70 100 56 Q84 58 82 46 Q98 44 95 30 Z"
        style={{ fill: "var(--art-gold)", stroke: "var(--art-line)" }}
        strokeWidth={2.5}
      />
      <circle cx="105" cy="112" r="16" style={{ ...artLine }} strokeWidth={2.5} />
      <g style={{ stroke: "var(--art-line)", fill: "none" }} strokeWidth={2}>
        <line x1="105" y1="98" x2="105" y2="126" />
        <line x1="91" y1="112" x2="119" y2="112" />
        <line x1="95" y1="102" x2="115" y2="122" />
        <line x1="115" y1="102" x2="95" y2="122" />
      </g>
    </svg>
  );
}

export function Kolam({ className = "" }: { className?: string }) {
  const dot = { fill: "var(--accent)", stroke: "none" } as const;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g style={{ stroke: "var(--accent)", fill: "none" }} strokeWidth={1.6} strokeLinecap="round">
        <circle cx="18" cy="18" r="2" style={dot} />
        <circle cx="42" cy="18" r="2" style={dot} />
        <circle cx="66" cy="18" r="2" style={dot} />
        <circle cx="18" cy="42" r="2" style={dot} />
        <circle cx="42" cy="42" r="2" style={dot} />
        <circle cx="18" cy="66" r="2" style={dot} />
        <path d="M18 30 Q30 30 30 18 Q30 6 18 6 Q6 6 6 18 Q6 30 18 30 Z" />
        <path d="M42 30 Q54 30 54 18 M42 42 Q54 42 54 30" />
        <path d="M30 42 Q30 54 18 54 Q6 54 6 42" />
        <path d="M18 42 Q30 42 30 30" />
      </g>
    </svg>
  );
}

export function Seal({ size = 92, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="45" style={{ fill: "none", stroke: "var(--accent)" }} strokeWidth={2.5} strokeDasharray="1.5 3" />
      <circle cx="50" cy="50" r="37" style={{ fill: "none", stroke: "var(--accent)" }} strokeWidth={2} />
      <text x="50" y="66" textAnchor="middle" className="telugu" style={{ fill: "var(--accent)", fontWeight: 700 }} fontSize={44}>
        కృ
      </text>
    </svg>
  );
}

const leaf = { fill: "var(--leaf)" } as const;
const rib = { stroke: "var(--line)", fill: "none" } as const;
const mari = { fill: "var(--marigold)" } as const;
const center = { fill: "var(--accent)" } as const;

function Marigold({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  const p = r / 2;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} style={mari} />
      <circle cx={r - 1} r={p} style={mari} />
      <circle cx={-(r - 1)} r={p} style={mari} />
      <circle cy={r - 1} r={p} style={mari} />
      <circle cy={-(r - 1)} r={p} style={mari} />
      <circle r={r * 0.42} style={center} />
    </g>
  );
}

function Parrot({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x},24)${flip ? " scale(-1,1)" : ""}`}>
      <path d="M0,0 C12,-9 34,-7 47,0 C34,7 12,9 0,0 Z" style={leaf} />
      <path d="M4,0 H40" style={rib} strokeWidth={1} />
      <polygon points="47,-3 56,0 47,3" style={mari} />
      <circle cx="38" cy="-2" r="1.7" style={{ fill: "var(--line)" }} />
    </g>
  );
}

export function Toranam({ className = "" }: { className?: string }) {
  const leaves: [number, number, number][] = [
    [150, 40, -5], [255, 49, 3], [360, 56, -3], [470, 60, 0],
    [530, 60, 0], [640, 56, 3], [745, 49, -3], [850, 40, 5],
  ];
  return (
    <svg viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden>
      <path d="M40,26 Q500,70 960,26" style={{ fill: "none", stroke: "var(--line)" }} strokeWidth={2} />
      <g style={leaf}>
        {leaves.map(([x, y, r], i) => {
          const len = y > 52 ? 51 : 47;
          const w = y > 52 ? 9 : 8;
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
              <path d={`M0,0 C-${w},13 -${w - 2},34 0,${len} C${w - 2},34 ${w},13 0,0 Z`} />
              <path d={`M0,4 V${len - 4}`} style={rib} strokeWidth={1} />
            </g>
          );
        })}
      </g>
      <Marigold x={205} y={45} />
      <Marigold x={500} y={59} r={9} />
      <Marigold x={795} y={45} />
      <Parrot x={55} />
      <Parrot x={945} flip />
    </svg>
  );
}

export function HeroChakra({ size = 46, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" strokeWidth={2.5} className={className} aria-hidden>
      <circle cx="23" cy="23" r="14" style={{ ...artGoldS }} />
      <circle cx="23" cy="23" r="5" style={{ fill: "var(--accent)" }} />
      <g style={{ ...artGoldS }} strokeLinecap="round">
        <line x1="23" y1="6" x2="23" y2="14" />
        <line x1="23" y1="32" x2="23" y2="40" />
        <line x1="6" y1="23" x2="14" y2="23" />
        <line x1="32" y1="23" x2="40" y2="23" />
      </g>
    </svg>
  );
}
