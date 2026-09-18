import { useMemo } from "react";
import * as THREE from "three";

/**
 * Brand palette, mirrored from the CSS design tokens in app/globals.css so the
 * 3D scenes stay on-brand without importing CSS.
 */
export const PALETTE = {
  black: "#0B0B0A",
  gold: "#C9A24B",
  goldBright: "#E8C572",
  offwhite: "#F7F5F0",
  greenRustic: "#3E4B34",
  greenMoss: "#5A6B45",
} as const;

/**
 * Builds a tiny 4-step gradient map used by MeshToonMaterial to get the banded,
 * "placeholder with personality" cel-shaded look. The texture is a 1D ramp of
 * increasing luminance; three quantises lighting to these steps.
 */
export function useToonGradient(): THREE.DataTexture {
  return useMemo(() => {
    const steps = new Uint8Array([70, 130, 190, 255]);
    const texture = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/** Radians helper for readable rotations. */
export const deg = (d: number): number => (d * Math.PI) / 180;
