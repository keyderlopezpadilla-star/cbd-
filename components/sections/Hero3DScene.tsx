"use client";

/**
 * Hero3DScene - the actual react-three-fiber scene for the home hero.
 *
 * It renders a field of slow-floating "pollen" particles in the brand gold and
 * green, with gentle depth-of-field-like layering and a subtle parallax driven
 * by the pointer (or gyroscope on touch devices). It is deliberately calm and
 * organic: slow drift, long ease, never agressive.
 *
 * This module is imported ONLY via next/dynamic({ ssr: false }) from
 * Hero3D.tsx, so it never runs on the server and never blocks first paint. If
 * WebGL is unavailable or the user prefers reduced motion, Hero3D renders the
 * 2D gradient fallback instead and this scene is never mounted.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const GOLD = new THREE.Color("#C9A24B");
const GOLD_BRIGHT = new THREE.Color("#E8C572");
const GREEN = new THREE.Color("#5A6B45");

interface PollenFieldProps {
  count: number;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

function PollenField({ count, pointer }: PollenFieldProps) {
  const points = useRef<THREE.Points>(null);

  // Build a stable set of particle positions, phase offsets and colours once.
  const { positions, colors, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const pick = Math.random();
      const color = pick > 0.66 ? GREEN : pick > 0.33 ? GOLD : GOLD_BRIGHT;
      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, phases };
  }, [count]);

  const basePositions = useMemo(() => positions.slice(), [positions]);

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    const time = state.clock.getElapsedTime();
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i += 1) {
      const phase = phases[i];
      // Slow, organic vertical drift + a touch of horizontal sway.
      attr.array[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(time * 0.25 + phase) * 0.35;
      attr.array[i * 3 + 0] = basePositions[i * 3 + 0] + Math.cos(time * 0.18 + phase) * 0.18;
    }
    attr.needsUpdate = true;

    // Subtle parallax: ease the whole field toward the pointer position.
    pts.rotation.y += (pointer.current.x * 0.25 - pts.rotation.y) * 0.03;
    pts.rotation.x += (-pointer.current.y * 0.2 - pts.rotation.x) * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ParallaxRig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.current.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (pointer.current.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3DScene() {
  // Shared pointer state, updated from pointer move + device orientation.
  const pointer = useRef({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const { innerWidth, innerHeight } = window;
    pointer.current.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.current.y = (event.clientY / innerHeight) * 2 - 1;
  }

  return (
    <div className="absolute inset-0" onPointerMove={handlePointerMove} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <PollenField count={260} pointer={pointer} />
        <ParallaxRig pointer={pointer} />
      </Canvas>
    </div>
  );
}
