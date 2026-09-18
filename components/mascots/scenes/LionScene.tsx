"use client";

import { useRef } from "react";
import * as THREE from "three";

import type { MascotSceneProps } from "../types";
import { Eyelids } from "./Eyelids";
import { PALETTE, deg, useToonGradient } from "./shared";
import { useMascotMotion } from "./useMascotMotion";

/**
 * LionScene - "The Guide" / boss.
 *
 * Original low-poly primitive placeholder: a rounded head with a spiky gold
 * mane ring (cones), muzzle and ears, in the brand palette. Not traced from any
 * client artwork. Swappable for lion.glb via the scene registry.
 */
export function LionScene({ event, reducedMotion }: MascotSceneProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();
  const motion = useMascotMotion(group, event, reducedMotion, true);

  const maneCount = 14;

  return (
    <group ref={group}>
      {/* Gold mane ring */}
      {Array.from({ length: maneCount }).map((_, i) => {
        const a = (i / maneCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.92, Math.sin(a) * 0.92, -0.1]}
            rotation={[deg(90), 0, -a + Math.PI / 2]}
          >
            <coneGeometry args={[0.28, 0.7, 6]} />
            <meshToonMaterial
              color={i % 2 === 0 ? PALETTE.gold : PALETTE.goldBright}
              gradientMap={gradientMap}
            />
          </mesh>
        );
      })}

      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.9, 20, 16]} />
        <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
      </mesh>

      {/* Ears */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.7, 0.1]}>
          <sphereGeometry args={[0.2, 10, 8]} />
          <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Muzzle */}
      <mesh position={[0, -0.28, 0.72]}>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.18, 1.06]}>
        <boxGeometry args={[0.16, 0.12, 0.1]} />
        <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
      </mesh>

      {/* Eyes */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.78]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
        </mesh>
      ))}

      <Eyelids
        motion={motion}
        color={PALETTE.goldBright}
        positions={[
          [-0.3, 0.12, 0.82],
          [0.3, 0.12, 0.82],
        ]}
      />
    </group>
  );
}
