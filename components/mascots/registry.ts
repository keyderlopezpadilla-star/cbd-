import type { ComponentType } from "react";

import { DoveScene } from "./scenes/DoveScene";
import { EagleScene } from "./scenes/EagleScene";
import { LionScene } from "./scenes/LionScene";
import { MonkeyScene } from "./scenes/MonkeyScene";
import { PandaScene } from "./scenes/PandaScene";
import type { MascotName, MascotSceneProps } from "./types";

/**
 * Scene registry: the single swap seam for the whole mascot system.
 *
 * Every mascot maps to an r3f scene component with the same `MascotSceneProps`
 * contract. To ship a final model, author a `GLBScene` (see the doc comment in
 * Mascot.tsx) and change ONE line here, e.g.:
 *
 *   lion: makeGLBScene("/mascots/lion.glb"),
 *
 * No caller, animation, or event code changes — the canvas keeps driving the
 * same idle loop and reactions through the shared props.
 */
export const MASCOT_SCENES: Record<MascotName, ComponentType<MascotSceneProps>> = {
  lion: LionScene,
  eagle: EagleScene,
  panda: PandaScene,
  monkey: MonkeyScene,
  dove: DoveScene,
};

/**
 * Human-readable, role-aware default aria labels (Spanish, ES default locale).
 * Callers may override with the `ariaLabel` prop.
 */
export const MASCOT_ARIA: Record<MascotName, string> = {
  lion: "León, la mascota guía de The Best Dreams",
  eagle: "Águila coronada, la mascota experta de The Best Dreams",
  panda: "Panda con gafas de sol, mascota de ofertas de The Best Dreams",
  monkey: "Mono con gafas de sol y cetro, mascota de ofertas de The Best Dreams",
  dove: "Paloma dorada de The Best Dreams",
};
