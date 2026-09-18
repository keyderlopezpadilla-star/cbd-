import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { MascotEvent } from "../types";

export type MascotMotionRef = React.MutableRefObject<MascotMotionState>;

export interface MascotMotionState {
  /** Uniform breathing scale multiplier (~1.0). */
  scale: number;
  /** Vertical bob offset in world units. */
  bob: number;
  /** Gentle left/right sway in radians. */
  swayY: number;
  /** Forward/back lean in radians (perk-up on hover, lean on reactions). */
  leanX: number;
  /** Blink factor 1 = eyes open, 0 = eyes shut. Drive eyelid scale with this. */
  blink: number;
  /** One-shot spin progress in radians (click reaction). */
  spinY: number;
}

/**
 * useMascotMotion
 *
 * Central driver for every scene's idle loop + event reactions so all five
 * mascots feel like one crew. It is intentionally geometry-agnostic: it mutates
 * a shared THREE.Group transform for breathing / bob / sway / lean / spin and
 * exposes a `blink` factor scenes apply to their own eyelids.
 *
 * Reduced motion freezes the loop to a calm static pose (scale 1, no bob/sway,
 * eyes open) while still honouring a subtle one-shot on discrete events so the
 * mascot never feels broken.
 */
export function useMascotMotion(
  groupRef: React.RefObject<THREE.Group>,
  event: MascotEvent,
  reducedMotion: boolean,
  autoIdle: boolean,
) {
  const state = useRef<MascotMotionState>({
    scale: 1,
    bob: 0,
    swayY: 0,
    leanX: 0,
    blink: 1,
    spinY: 0,
  });

  // Tracks discrete-event timelines that play once then settle.
  const reaction = useRef({
    active: null as MascotEvent | null,
    t: 0,
    prev: "idle" as MascotEvent,
  });

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;

    // Clamp delta so a paused tab / slow frame doesn't teleport the animation.
    const delta = Math.min(rawDelta, 0.05);
    const s = state.current;
    const r = reaction.current;

    // Detect a freshly-fired discrete reaction (hover is a sustained pose, the
    // others are one-shot timelines).
    if (event !== r.prev) {
      if (event === "click" || event === "addtocart" || event === "inview") {
        r.active = event;
        r.t = 0;
      }
      r.prev = event;
    }

    // Accumulate a per-group clock so each mascot's idle phase is independent.
    const prevClock = typeof group.userData.clock === "number" ? group.userData.clock : 0;
    const time = prevClock + delta;
    group.userData.clock = time;

    if (reducedMotion || !autoIdle) {
      // Frozen calm pose. Ease everything back to neutral.
      s.scale += (1 - s.scale) * Math.min(1, delta * 8);
      s.bob += (0 - s.bob) * Math.min(1, delta * 8);
      s.swayY += (0 - s.swayY) * Math.min(1, delta * 8);
      s.leanX += (0 - s.leanX) * Math.min(1, delta * 8);
      s.blink = 1;
      s.spinY += (0 - s.spinY) * Math.min(1, delta * 8);
    } else {
      // --- Permanent idle loop (never fully still) ---
      // Breathing: slow sinusoidal scale.
      const breathe = 1 + Math.sin(time * 1.6) * 0.03;
      // Sway: gentle horizontal rotation.
      const sway = Math.sin(time * 0.9) * 0.08;
      // Bob: subtle vertical float coupled to breathing.
      const bob = Math.sin(time * 1.6) * 0.02;
      // Blink: mostly open, quick periodic closes about every ~4s.
      const blinkPhase = (time % 4) / 4;
      const blink =
        blinkPhase > 0.96 ? Math.abs(Math.cos((blinkPhase - 0.96) * (Math.PI / 0.04))) : 1;

      s.scale += (breathe - s.scale) * Math.min(1, delta * 6);
      s.swayY += (sway - s.swayY) * Math.min(1, delta * 6);
      s.bob += (bob - s.bob) * Math.min(1, delta * 6);
      s.blink = blink;

      // Hover = sustained perk up (lean forward + slight scale).
      const targetLean = event === "hover" ? -0.14 : 0;
      const hoverScale = event === "hover" ? 0.05 : 0;
      s.leanX += (targetLean - s.leanX) * Math.min(1, delta * 10);
      s.scale += hoverScale * Math.min(1, delta * 4);
    }

    // --- One-shot reaction timelines (play even under reduced motion, subtly) ---
    if (r.active) {
      r.t += delta;
      const amp = reducedMotion ? 0.35 : 1;
      if (r.active === "click") {
        // Little jump + single spin over ~0.6s.
        const p = Math.min(1, r.t / 0.6);
        const jump = Math.sin(p * Math.PI) * 0.25 * amp;
        s.bob += jump;
        s.spinY = p < 1 ? p * Math.PI * 2 * amp : 0;
        if (p >= 1) r.active = null;
      } else if (r.active === "addtocart") {
        // Celebratory double bob over ~0.9s.
        const p = Math.min(1, r.t / 0.9);
        s.bob += Math.abs(Math.sin(p * Math.PI * 2)) * 0.2 * amp;
        if (p >= 1) r.active = null;
      } else if (r.active === "inview") {
        // One greeting lean-and-return over ~0.7s.
        const p = Math.min(1, r.t / 0.7);
        s.leanX += Math.sin(p * Math.PI) * -0.2 * amp;
        if (p >= 1) r.active = null;
      }
    }

    // Apply accumulated transform to the shared group.
    group.scale.setScalar(s.scale);
    group.position.y = s.bob;
    group.rotation.y = s.swayY + s.spinY;
    group.rotation.x = s.leanX;
  });

  return state;
}
