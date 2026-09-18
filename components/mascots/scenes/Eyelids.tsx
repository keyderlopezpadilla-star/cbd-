"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { PALETTE, useToonGradient } from "./shared";
import type { MascotMotionRef } from "./useMascotMotion";

interface EyelidsProps {
  /** Motion state whose `blink` factor (1 open, 0 shut) drives the lids. */
  motion: MascotMotionRef;
  /** World positions of each eye the lid should cover. */
  positions: Array<[number, number, number]>;
  /** Lid radius. */
  radius?: number;
  /** Lid color (usually the face color so it reads as a closing eyelid). */
  color?: string;
}

/**
 * Shared blink helper. Renders a hemispherical "lid" over each eye and scales
 * it on Y from the motion state's `blink` factor every frame, so all mascots
 * blink in a consistent way without duplicating the useFrame wiring.
 */
export function Eyelids({
  motion,
  positions,
  radius = 0.13,
  color = PALETTE.goldBright,
}: EyelidsProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    // blink: 1 = open (lid hidden), 0 = shut (lid fully covers eye).
    g.scale.y = Math.max(0.001, 1 - motion.current.blink);
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[radius, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshToonMaterial color={color} gradientMap={gradientMap} />
        </mesh>
      ))}
    </group>
  );
}
