import type { CSSProperties } from "react";

import { MASCOT_ARIA } from "./registry";
import type { MascotName } from "./types";

/** Brand palette mirrored for the inline SVG art (kept in sync with tokens). */
const C = {
  black: "#0B0B0A",
  gold: "#C9A24B",
  goldBright: "#E8C572",
  offwhite: "#F7F5F0",
  greenRustic: "#3E4B34",
  greenMoss: "#5A6B45",
};

interface Mascot2DFallbackProps {
  name: MascotName;
  size: number;
  className?: string;
  ariaLabel?: string;
  style?: CSSProperties;
}

/**
 * Mascot2DFallback
 *
 * Lightweight, original inline-SVG silhouette per mascot in the brand palette.
 * Used when WebGL is unavailable, on reduced-motion + low-end devices, and as
 * the loading placeholder while the 3D canvas lazy-loads. No external assets,
 * no emoji, no traced artwork — simple primitive shapes echoing each 3D scene.
 */
export function Mascot2DFallback({
  name,
  size,
  className,
  ariaLabel,
  style,
}: Mascot2DFallbackProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel ?? MASCOT_ARIA[name]}
      className={className}
      style={{ display: "inline-block", width: size, height: size, lineHeight: 0, ...style }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {ART[name]}
      </svg>
    </span>
  );
}

/** Per-mascot SVG fragments. Kept intentionally simple and on-brand. */
const ART: Record<MascotName, JSX.Element> = {
  lion: (
    <g>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={50 + Math.cos(a) * 30}
            cy={50 + Math.sin(a) * 30}
            r={11}
            fill={i % 2 ? C.gold : C.goldBright}
          />
        );
      })}
      <circle cx="50" cy="50" r="26" fill={C.goldBright} />
      <circle cx="50" cy="58" r="13" fill={C.offwhite} />
      <circle cx="42" cy="46" r="3.4" fill={C.black} />
      <circle cx="58" cy="46" r="3.4" fill={C.black} />
      <ellipse cx="50" cy="55" rx="3.2" ry="2.2" fill={C.black} />
    </g>
  ),
  eagle: (
    <g>
      <circle cx="50" cy="52" r="27" fill={C.offwhite} />
      <path d="M25 40 Q50 20 75 40 L50 30 Z" fill={C.greenRustic} />
      {Array.from({ length: 5 }).map((_, i) => (
        <polygon
          key={i}
          points={`${34 + i * 8},26 ${38 + i * 8},10 ${42 + i * 8},26`}
          fill={C.gold}
        />
      ))}
      <circle cx="41" cy="50" r="3.6" fill={C.black} />
      <circle cx="59" cy="50" r="3.6" fill={C.black} />
      <polygon points="50,54 44,62 56,62" fill={C.gold} />
    </g>
  ),
  panda: (
    <g>
      <circle cx="30" cy="26" r="12" fill={C.black} />
      <circle cx="70" cy="26" r="12" fill={C.black} />
      <circle cx="50" cy="52" r="30" fill={C.offwhite} />
      <rect x="30" y="44" width="16" height="12" rx="3" fill={C.black} />
      <rect x="54" y="44" width="16" height="12" rx="3" fill={C.black} />
      <rect x="46" y="48" width="8" height="4" fill={C.gold} />
      <rect
        x="28"
        y="42"
        width="20"
        height="16"
        rx="4"
        fill="none"
        stroke={C.gold}
        strokeWidth="1.6"
      />
      <rect
        x="52"
        y="42"
        width="20"
        height="16"
        rx="4"
        fill="none"
        stroke={C.gold}
        strokeWidth="1.6"
      />
      <ellipse cx="50" cy="66" rx="6" ry="4" fill={C.greenMoss} />
    </g>
  ),
  monkey: (
    <g>
      <circle cx="22" cy="46" r="12" fill={C.greenMoss} />
      <circle cx="78" cy="46" r="12" fill={C.greenMoss} />
      <circle cx="50" cy="50" r="28" fill={C.greenRustic} />
      <ellipse cx="50" cy="58" rx="18" ry="16" fill={C.offwhite} />
      <rect x="32" y="42" width="15" height="12" rx="3" fill={C.black} />
      <rect x="53" y="42" width="15" height="12" rx="3" fill={C.black} />
      <rect x="47" y="46" width="6" height="4" fill={C.gold} />
      <circle cx="46" cy="62" r="2.2" fill={C.black} />
      <circle cx="54" cy="62" r="2.2" fill={C.black} />
      <rect
        x="80"
        y="30"
        width="3"
        height="45"
        rx="1.5"
        fill={C.gold}
        transform="rotate(12 81 52)"
      />
      <circle cx="86" cy="30" r="5" fill={C.goldBright} />
    </g>
  ),
  dove: (
    <g>
      <ellipse cx="48" cy="58" rx="26" ry="18" fill={C.gold} transform="rotate(-12 48 58)" />
      <circle cx="64" cy="40" r="13" fill={C.goldBright} />
      <polygon points="76,40 90,44 76,48" fill={C.black} />
      <circle cx="66" cy="38" r="2.4" fill={C.black} />
      <path d="M30 52 Q10 40 20 66 Q34 62 40 56 Z" fill={C.goldBright} />
      <path d="M26 66 Q12 80 34 78 Z" fill={C.gold} />
    </g>
  ),
};
