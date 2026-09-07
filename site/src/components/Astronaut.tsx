/**
 * THE FIGURE.
 *
 * The landscape under the sign-off is generated; this is not. It is
 * drawn, once, by hand, because a flow field can make a dune but it
 * cannot make a person — and the reference this section is built from
 * has someone standing in it.
 *
 * Cut to the same house rules as everything else: flat cream plates,
 * ink outlines of one weight, a single orange element. The visor is the
 * only saturated thing in the picture, which is what makes it the thing
 * you look at first.
 *
 * Drawn head-down, cropped at the thigh by the viewBox — the frame ends
 * before the figure does, the way it does in the reference.
 */
export default function Astronaut({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 660"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="var(--as-ink, #0B1220)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* life support, over the left shoulder */}
        <rect
          x="278"
          y="180"
          width="66"
          height="212"
          rx="24"
          fill="var(--as-suit, #E8DCC7)"
        />
        <g strokeWidth="4" opacity="0.75">
          <path d="M322 232h16M322 276h16M322 320h16M322 364h16" />
        </g>

        {/* legs, behind the torso and out of the bottom of the frame */}
        <g strokeWidth="6">
          <path
            d="M170 400v260"
            stroke="var(--as-ink, #0B1220)"
            strokeWidth="82"
          />
          <path
            d="M170 400v260"
            stroke="var(--as-suit, #E8DCC7)"
            strokeWidth="70"
          />
          <path
            d="M238 400v260"
            stroke="var(--as-ink, #0B1220)"
            strokeWidth="82"
          />
          <path
            d="M238 400v260"
            stroke="var(--as-suit, #E8DCC7)"
            strokeWidth="70"
          />
        </g>
        {/* the joint rings — a pressure suit is a stack of hoops */}
        <g strokeWidth="4" opacity="0.7">
          <path d="M136 486h68M136 546h68M204 486h68M204 546h68" />
        </g>

        {/* torso */}
        <path
          d="M138 232q2-22 24-24h76q22 2 24 24l12 158q2 26-26 30H152q-28-4-26-30z"
          fill="var(--as-suit, #E8DCC7)"
        />

        {/* arms */}
        <g>
          <path
            d="M142 246c-30 20-44 62-44 108 0 34 4 56 8 72"
            stroke="var(--as-ink, #0B1220)"
            strokeWidth="62"
          />
          <path
            d="M142 246c-30 20-44 62-44 108 0 34 4 56 8 72"
            stroke="var(--as-suit, #E8DCC7)"
            strokeWidth="50"
          />
          <path
            d="M258 246c28 20 40 62 40 108 0 34-4 56-8 72"
            stroke="var(--as-ink, #0B1220)"
            strokeWidth="62"
          />
          <path
            d="M258 246c28 20 40 62 40 108 0 34-4 56-8 72"
            stroke="var(--as-suit, #E8DCC7)"
            strokeWidth="50"
          />
        </g>
        <g strokeWidth="4" opacity="0.7">
          <path d="M74 330h48M76 372h46M274 330h46M274 372h44" />
        </g>

        {/* gloves */}
        <circle cx="108" cy="440" r="27" fill="var(--as-suit, #E8DCC7)" />
        <circle cx="288" cy="440" r="27" fill="var(--as-suit, #E8DCC7)" />

        {/* the control panel on the chest, and the hoses running back to
            the pack — the two details that say this is a suit and not a
            coat */}
        <rect
          x="164"
          y="272"
          width="82"
          height="60"
          rx="10"
          fill="var(--as-suit, #E8DCC7)"
          strokeWidth="5"
        />
        <g strokeWidth="4" opacity="0.8">
          <path d="M176 292h34M176 308h48" />
        </g>
        <circle
          cx="230"
          cy="294"
          r="7"
          fill="var(--as-visor, #C75340)"
          strokeWidth="0"
        />
        <path
          d="M246 288c10-1 17-5 21-12M246 314c11 1 19-2 24-9"
          strokeWidth="7"
        />

        {/* neck ring */}
        <rect
          x="162"
          y="182"
          width="76"
          height="34"
          rx="14"
          fill="var(--as-suit, #E8DCC7)"
        />

        {/* helmet */}
        <rect
          x="96"
          y="92"
          width="30"
          height="58"
          rx="13"
          fill="var(--as-suit, #E8DCC7)"
        />
        <rect
          x="274"
          y="92"
          width="30"
          height="58"
          rx="13"
          fill="var(--as-suit, #E8DCC7)"
        />
        <circle
          cx="200"
          cy="118"
          r="92"
          fill="var(--as-suit, #E8DCC7)"
          strokeWidth="7"
        />
        <circle
          cx="200"
          cy="114"
          r="63"
          fill="var(--as-visor, #C75340)"
          strokeWidth="6"
        />
        <ellipse
          cx="176"
          cy="90"
          rx="17"
          ry="10"
          transform="rotate(-32 176 90)"
          fill="var(--as-suit, #E8DCC7)"
          opacity="0.5"
          strokeWidth="0"
        />
        {/* antenna */}
        <path
          d="M264 54l24-26"
          stroke="var(--as-suit, #E8DCC7)"
          strokeWidth="7"
        />
        <circle
          cx="290"
          cy="26"
          r="8"
          fill="var(--as-suit, #E8DCC7)"
          strokeWidth="5"
        />
      </g>
    </svg>
  );
}
