"use client";

/**
 * Mascot — the single public entry point for the 3D mascot crew.
 *
 * Usage:
 *   <Mascot name="lion" />
 *   <Mascot name="panda" size={200} reactTo={["hover", "click", "addtocart"]} />
 *
 * Only `name` is required. This component decides between the lazy-loaded 3D
 * canvas and the 2D fallback, and never lets 3D block first paint or hurt
 * performance:
 *   - MascotCanvas is imported via next/dynamic({ ssr: false }); the 2D
 *     silhouette is the `loading` placeholder, so SSR/first paint is instant.
 *   - The 2D fallback is used permanently when WebGL is unavailable, or on
 *     reduced-motion + low-end devices.
 *   - prefers-reduced-motion is forwarded to the scenes, which freeze intensive
 *     motion into a calm pose.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO SWAP A PLACEHOLDER FOR A FINAL .glb  (one-line change, no caller edits)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Drop the model at `public/mascots/<name>.glb` (see public/mascots/README.md).
 * 2. Author a GLB scene that honours the same `MascotSceneProps` contract, e.g.:
 *
 *      // components/mascots/scenes/GLBScene.tsx
 *      import { useGLTF } from "@react-three/drei";
 *      import { useRef } from "react";
 *      import * as THREE from "three";
 *      import type { MascotSceneProps } from "../types";
 *      import { useMascotMotion } from "./useMascotMotion";
 *
 *      export function makeGLBScene(url: string) {
 *        function GLBScene({ event, reducedMotion }: MascotSceneProps) {
 *          const group = useRef<THREE.Group>(null);
 *          useMascotMotion(group, event, reducedMotion, true);
 *          const { scene } = useGLTF(url);
 *          return <group ref={group}><primitive object={scene} /></group>;
 *        }
 *        return GLBScene;
 *      }
 *
 * 3. In components/mascots/registry.ts change ONE line:
 *
 *      lion: makeGLBScene("/mascots/lion.glb"),
 *
 * Nothing else changes: callers still write <Mascot name="lion" />, and the
 * idle loop + hover/click/inview/add-to-cart reactions keep working because the
 * canvas drives every scene through the same props.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { isLowEndDevice, isWebGLAvailable } from "./webgl";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

import { Mascot2DFallback } from "./Mascot2DFallback";
import { MASCOT_ARIA } from "./registry";
import type { MascotEvent, MascotProps } from "./types";

const DEFAULT_REACTIONS: MascotEvent[] = ["hover", "click", "inview", "addtocart"];

const MascotCanvas = dynamic(() => import("./MascotCanvas"), {
  ssr: false,
});

export function Mascot({
  name,
  size = 160,
  className,
  reactTo = DEFAULT_REACTIONS,
  autoIdle = true,
  ariaLabel,
  addToCartSignal,
}: MascotProps) {
  const reducedMotion = useReducedMotion();
  const label = ariaLabel ?? MASCOT_ARIA[name];

  // Client-only capability check. Start with the 2D fallback (also the SSR
  // output) and upgrade to 3D once we know the device can handle it.
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const capable = isWebGLAvailable() && !(reducedMotion && isLowEndDevice());
    setUse3D(capable);
  }, [reducedMotion]);

  const fallback = (
    <Mascot2DFallback name={name} size={size} ariaLabel={label} className={className} />
  );

  if (!use3D) {
    return fallback;
  }

  return (
    <span className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <MascotCanvas
        name={name}
        size={size}
        reactTo={reactTo}
        autoIdle={autoIdle}
        ariaLabel={label}
        addToCartSignal={addToCartSignal}
      />
    </span>
  );
}

export default Mascot;
