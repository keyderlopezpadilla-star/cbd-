"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

import { useInViewOnce } from "@/lib/motion/useInViewOnce";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

import { MASCOT_SCENES } from "./registry";
import type { MascotEvent, MascotName } from "./types";

export interface MascotCanvasProps {
  name: MascotName;
  size: number;
  reactTo: MascotEvent[];
  autoIdle: boolean;
  ariaLabel: string;
  addToCartSignal?: number;
  /** Optional OrbitControls toggle. Disabled by default (decorative mascot). */
  interactive?: boolean;
}

/**
 * MascotCanvas
 *
 * The r3f <Canvas> wrapper. It owns lighting, camera and dpr clamping, resolves
 * the scene from the registry, and translates DOM interaction (hover / click /
 * scroll-into-view) plus an external add-to-cart signal into the single
 * `event` prop the scene understands. This is the only place that knows about
 * events; scenes stay pure and swappable.
 *
 * This module is imported via `next/dynamic({ ssr: false })` from Mascot.tsx,
 * so it never runs on the server.
 */
export default function MascotCanvas({
  name,
  size,
  reactTo,
  autoIdle,
  ariaLabel,
  addToCartSignal,
  interactive = false,
}: MascotCanvasProps) {
  const reducedMotion = useReducedMotion();
  const Scene = MASCOT_SCENES[name];

  const allow = useMemo(() => new Set(reactTo), [reactTo]);

  const [hovered, setHovered] = useState(false);
  const [event, setEvent] = useState<MascotEvent>("idle");

  // Scroll-into-view: fire a one-shot greeting the first time visible.
  const [inViewRef, inView] = useInViewOnce<HTMLDivElement>({
    enabled: allow.has("inview"),
  });

  // Timers for one-shot reactions so they settle back to hover/idle.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearReset = () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const settle = () => {
    setEvent(hovered && allow.has("hover") ? "hover" : "idle");
  };

  const fireOneShot = (kind: MascotEvent, ms: number) => {
    clearReset();
    setEvent(kind);
    resetTimer.current = setTimeout(() => settle(), ms);
  };

  // Sustained hover pose.
  useEffect(() => {
    if (!resetTimer.current) {
      setEvent(hovered && allow.has("hover") ? "hover" : "idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  // In-view one-shot.
  useEffect(() => {
    if (inView && allow.has("inview")) {
      fireOneShot("inview", 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // External add-to-cart signal -> celebratory bob.
  const firstSignal = useRef(true);
  useEffect(() => {
    if (firstSignal.current) {
      firstSignal.current = false;
      return;
    }
    if (allow.has("addtocart")) {
      fireOneShot("addtocart", 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToCartSignal]);

  useEffect(() => () => clearReset(), []);

  const handleClick = () => {
    if (allow.has("click")) {
      fireOneShot("click", 700);
    }
  };

  // Clamp dpr for performance on high-density displays.
  const dpr: [number, number] = [1, 1.75];

  return (
    <div
      ref={inViewRef}
      role="img"
      aria-label={ariaLabel}
      style={{ width: size, height: size }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} color="#E8C572" />
        <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#5A6B45" />
        <group scale={size < 120 ? 0.9 : 1}>
          <Scene event={autoIdle ? event : "idle"} reducedMotion={reducedMotion || !autoIdle} />
        </group>
        {interactive ? <OrbitControls enablePan={false} enableZoom={false} enableRotate /> : null}
      </Canvas>
    </div>
  );
}
