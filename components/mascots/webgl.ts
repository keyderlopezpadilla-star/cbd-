/**
 * Cheap WebGL capability probe used to decide between the 3D canvas and the 2D
 * fallback. Cached after the first call. SSR-safe: returns false on the server.
 */
let cached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cached !== null) {
    return cached;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = Boolean(gl);
  } catch {
    cached = false;
  }

  return cached;
}

/**
 * Rough low-end heuristic: very few logical cores or a coarse pointer with a
 * small viewport suggests a budget mobile device where we prefer the 2D
 * fallback (especially combined with reduced-motion).
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const cores =
    typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (cores > 0 && cores <= 2) {
    return true;
  }
  if (typeof deviceMemory === "number" && deviceMemory > 0 && deviceMemory <= 2) {
    return true;
  }
  return false;
}
