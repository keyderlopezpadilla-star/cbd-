"use client";

import { useRef } from "react";
import * as THREE from "three";

import type { MascotSceneProps } from "../types";
import { Eyelids } from "./Eyelids";
import { PALETTE, deg, useToonGradient } from "./shared";
import { useMascotMotion } from "./useMascotMotion";

/**
 * PandaScene - "Deals" / fun mascot (shades + cane).
 *
 * Original low-poly placeholder: an off-white head with black ears and cheeks,
 * gold sunglasses (two lens boxes + bridge), and a slim gold cane. Swappable
 * for panda.glb via the scene registry.
 */
export function PandaScene({ event, reducedMotion }: MascotSceneProps) {
  const group = useRef<THREE.Group>(null);
  const gradientMap = useToonGradient();
  const motion = useMascotMotion(group, event, reducedMotion, true);

  return (
    <group ref={group}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.9, 20, 16]} />
        <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
      </mesh>

      {/* Ears */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.72, -0.05]}>
          <sphereGeometry args={[0.26, 12, 10]} />
          <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Cheek patches */}
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, -0.35, 0.62]} scale={[1, 1.1, 0.6]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshToonMaterial color={PALETTE.greenMoss} gradientMap={gradientMap} />
        </mesh>
      ))}

      {/* Snout */}
      <mesh position={[0, -0.22, 0.82]}>
        <sphereGeometry args={[0.28, 14, 12]} />
        <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, -0.12, 1.02]}>
        <boxGeometry args={[0.14, 0.1, 0.08]} />
        <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
      </mesh>

      {/* Sunglasses: two gold-rimmed black lenses + bridge */}
      {[-0.34, 0.34].map((x) => (
        <group key={x} position={[x, 0.14, 0.78]}>
          <mesh>
            <boxGeometry args={[0.34, 0.26, 0.06]} />
            <meshToonMaterial color={PALETTE.black} gradientMap={gradientMap} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.38, 0.3, 0.02]} />
            <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} wireframe />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.16, 0.82]}>
        <boxGeometry args={[0.16, 0.05, 0.05]} />
        <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
      </mesh>

      {/* Eyes behind the shades (drive the blink) */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.14, 0.72]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshToonMaterial color={PALETTE.offwhite} gradientMap={gradientMap} />
        </mesh>
      ))}
      <Eyelids
        motion={motion}
        color={PALETTE.black}
        radius={0.1}
        positions={[
          [-0.34, 0.14, 0.74],
          [0.34, 0.14, 0.74],
        ]}
      />

      {/* Gold cane */}
      <group position={[0.95, -0.5, 0.4]} rotation={[0, 0, deg(-12)]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1.3, 8]} />
          <meshToonMaterial color={PALETTE.gold} gradientMap={gradientMap} />
        </mesh>
        <mesh position={[-0.1, 0.68, 0]} rotation={[0, 0, deg(90)]}>
          <torusGeometry args={[0.12, 0.05, 8, 16, Math.PI]} />
          <meshToonMaterial color={PALETTE.goldBright} gradientMap={gradientMap} />
        </mesh>
      </group>
    </group>
  );
}
