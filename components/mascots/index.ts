/**
 * Public surface of the mascot system.
 *
 * Application code should import from here (or from "./Mascot") and use only
 * the <Mascot name=... /> component. Scenes, the canvas, the registry and the
 * motion internals are implementation details behind the .glb swap seam.
 */
export { Mascot, default } from "./Mascot";
export type { MascotName, MascotEvent, MascotProps } from "./types";
