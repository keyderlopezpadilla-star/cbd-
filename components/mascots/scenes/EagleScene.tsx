"use client";

import { useRef } from "react";
import * as THREE from "three";

import type { MascotSceneProps } from "../types";
import { Eyelids } from "./Eyelids";
import { PALETTE, deg, useToonGradient } from "./shared";
import { useMascotMotion } from "./useMascotMotion";

/**
 * EagleScene - "The Expert" (crowned, echoes the brand logo).
 *
 * Original low-poly placeholder: a dark head with a hooked gold beak, swept
 * wing/brow shapes and a small gold crown (ring of cones). Swappable for
 * eagle.glb via the scene registry.
 */
export function EagleScene({ event, reducedMotion }: MascotSceneProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();
  const motion = useMascotMotion(group, event, reducedMotion, true);

  const crownCount = 7;

  return (
    <group ref={group}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.85, 20, 16]} />
        <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
      </mesh>

      {/* Back-of-head / feathers cap */}
      <mesh position={[0, 0.2, -0.15]} scale={[1.05, 1, 1.05]}>
        <sphereGeometry args={[0.8, 18, 14, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshToonMaterial color={PALETTE.greenRustic} gradientMap={gradientMap} />
      </mesh>

      {/* Gold crown */}
      {Array.from({ length: crownCount }).map((_, i) => {
        const a = (i / (crownCount - 1) - 0.5) * Math.PI;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.62, 0.85, Math.cos(a) * 0.4]}
            rotation={[deg(-10), 0, 0]}
          >
            <coneGeometry args={[0.09, 0.34, 5]} />
            <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
          </mesh>
        );
      })}
      {/* Crown band */}
      <mesh position={[0, 0.68, 0.18]} rotation={[deg(90), 0, 0]}>
        <torusGeometry args={[0.6, 0.06, 8, 20, Math.PI]} />
        <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
      </mesh>

      {/* Brow ridge for a fierce expert look */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.28, 0.7]} rotation={[0, 0, x < 0 ? deg(18) : deg(-18)]}>
          <boxGeometry args={[0.36, 0.1, 0.14]} />
          <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Beak: hooked gold cone */}
      <mesh position={[0, -0.05, 0.9]} rotation={[deg(90), 0, 0]}>
        <coneGeometry args={[0.22, 0.5, 8]} />
        <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, -0.2, 1.02]}>
        <boxGeometry args={[0.16, 0.12, 0.2]} />
        <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
      </mesh>

      {/* Eyes */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.72]}>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
        </mesh>
      ))}

      <Eyelids
        motion={motion}
        color={PALETTE.offwhite}
        radius={0.15}
        positions={[
          [-0.32, 0.12, 0.76],
          [0.32, 0.12, 0.76],
        ]}
      />
    </group>
  );
}
