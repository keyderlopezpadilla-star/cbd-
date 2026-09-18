"use client";

import { useRef } from "react";
import * as THREE from "three";

import type { MascotSceneProps } from "../types";
import { Eyelids } from "./Eyelids";
import { PALETTE, deg, useToonGradient } from "./shared";
import { useMascotMotion } from "./useMascotMotion";

/**
 * MonkeyScene - alternate "Deals" mascot (shades + "Marqués" scepter).
 *
 * Original low-poly placeholder: a dark head with a lighter muzzle disc, big
 * round ears, gold sunglasses, and a gold scepter topped with a jewel.
 * Swappable for monkey.glb via the scene registry.
 */
export function MonkeyScene({ event, reducedMotion }: MascotSceneProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();
  const motion = useMascotMotion(group, event, reducedMotion, true);

  return (
    <group ref={group}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.88, 20, 16]} />
        <meshToonMaterial color={PALETTE.greenRustic} gradientMap={gradientMap} />
      </mesh>

      {/* Big round ears */}
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <sphereGeometry args={[0.3, 12, 10]} />
          <meshToonMaterial color={PALETTE.greenMoss} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Face disc / muzzle */}
      <mesh position={[0, -0.12, 0.6]} scale={[1, 1.05, 0.5]}>
        <sphereGeometry args={[0.6, 16, 14]} />
        <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
      </mesh>

      {/* Nostrils */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, -0.18, 0.95]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Sunglasses */}
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.1, 0.82]}>
          <mesh>
            <boxGeometry args={[0.3, 0.24, 0.06]} />
            <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.34, 0.28, 0.02]} />
            <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} wireframe />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.12, 0.86]}>
        <boxGeometry args={[0.14, 0.05, 0.05]} />
        <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
      </mesh>

      {/* Eyes + blink */}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.76]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
        </mesh>
      ))}
      <Eyelids
        motion={motion}
        color={PALETTE.greenRustic}
        radius={0.09}
        positions={[
          [-0.28, 0.1, 0.78],
          [0.28, 0.1, 0.78],
        ]}
      />

      {/* "Marqués" scepter: gold rod topped with a jewel */}
      <group position={[1.0, -0.35, 0.4]} rotation={[0, 0, deg(-14)]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 1.4, 8]} />
          <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, 0.78, 0]}>
          <icosahedronGeometry args={[0.16, 0]} />
          <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, 0.78, 0]}>
          <torusGeometry args={[0.2, 0.03, 8, 16]} />
          <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
        </mesh>
      </group>
    </group>
  );
}
