"use client";

import { useRef } from "react";
import * as THREE from "three";

import type { MascotSceneProps } from "../types";
import { Eyelids } from "./Eyelids";
import { PALETTE, deg, useToonGradient } from "./shared";
import { useMascotMotion } from "./useMascotMotion";

/**
 * DoveScene - golden dove, secondary motif (loader accent).
 *
 * Original low-poly placeholder: a golden body (elongated sphere), a smaller
 * head, a swept tail cone, and two wing shapes that flap subtly with the idle
 * sway. Swappable for dove.glb via the scene registry.
 */
export function DoveScene({ event, reducedMotion }: MascotSceneProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();
  const motion = useMascotMotion(group, event, reducedMotion, true);

  return (
    <group ref={group}>
      {/* Body */}
      <mesh rotation={[deg(-12), 0, 0]} scale={[0.8, 0.9, 1.3]}>
        <sphereGeometry args={[0.7, 18, 14]} />
        <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.55, 0.55]}>
        <sphereGeometry args={[0.4, 16, 14]} />
        <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.5, 0.92]} rotation={[deg(90), 0, 0]}>
        <coneGeometry args={[0.09, 0.28, 6]} />
        <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
      </mesh>

      {/* Eyes + blink */}
      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.78]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
        </mesh>
      ))}
      <Eyelids
        motion={motion}
        color={PALETTE.goldBright}
        radius={0.07}
        positions={[
          [-0.16, 0.6, 0.8],
          [0.16, 0.6, 0.8],
        ]}
      />

      {/* Wings: flattened cones sweeping back, gently flapping via userData */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.55, 0.1, -0.1]}
          rotation={[deg(90), 0, side * deg(35)]}
          scale={[0.5, 1, 1]}
        >
          <coneGeometry args={[0.35, 1.1, 5]} />
          <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Tail */}
      <mesh position={[0, -0.2, -0.85]} rotation={[deg(-70), 0, 0]} scale={[1.4, 1, 0.4]}>
        <coneGeometry args={[0.4, 0.8, 6]} />
        <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
      </mesh>
    </group>
  );
}
