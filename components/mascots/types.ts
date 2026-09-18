/**
 * Mascot system types.
 *
 * The mascot crew are the real brand animals for "The Best Dreams" (TBD).
 * Each name maps to a role that later features consume:
 *
 *   lion   = "The Guide" / boss  -> age-verification modal + onboarding
 *   eagle  = "The Expert" (crowned, matches the logo) -> product / lab pages
 *   panda  = "Deals" / fun mascot (shades + cane) -> cart / newsletter / offers
 *   monkey = alternate "Deals" mascot (shades + "Marqués" scepter)
 *   dove   = golden dove, secondary motif -> loader accent
 *
 * The concrete geometry is an ORIGINAL low-poly primitive placeholder today;
 * it is swappable for a final `.glb` per mascot with no changes to callers or
 * to the animation/event logic (see components/mascots/Mascot.tsx).
 */
export type MascotName = "lion" | "eagle" | "panda" | "monkey" | "dove";

/**
 * Events a mascot can react to.
 *
 *   idle      = permanent breathing / blink / sway loop (never fully still)
 *   hover     = perk up
 *   click     = little jump / spin
 *   inview    = one-shot greeting when scrolled into view
 *   addtocart = celebratory bob
 */
export type MascotEvent = "idle" | "hover" | "click" | "inview" | "addtocart";

/**
 * The single public prop contract. Only `name` is required.
 */
export interface MascotProps {
  /** Which brand animal to render. */
  name: MascotName;
  /** Rendered square size in pixels (canvas + fallback). Defaults to 160. */
  size?: number;
  /** Extra class names applied to the outer wrapper. */
  className?: string;
  /**
   * Which events the mascot is allowed to react to. Defaults to all of them.
   * `idle` is always active (unless reduced-motion freezes it).
   */
  reactTo?: MascotEvent[];
  /** Whether the permanent idle loop runs. Defaults to true. */
  autoIdle?: boolean;
  /** Accessible label. Falls back to a role-based description per mascot. */
  ariaLabel?: string;
  /**
   * Optional external add-to-cart trigger. Increment this number (e.g. from a
   * cart store selector) to fire the celebratory reaction. Decoupled from any
   * specific store so the mascot stays reusable.
   */
  addToCartSignal?: number;
}

/**
 * Props every scene component receives from the canvas. Scenes are pure r3f
 * subtrees: they own their geometry + idle loop and react to `event`, but know
 * nothing about the DOM, WebGL detection, or lazy loading.
 */
export interface MascotSceneProps {
  /** The currently active reaction (or "idle"). */
  event: MascotEvent;
  /** When true, intensive motion is frozen to a calm static pose. */
  reducedMotion: boolean;
}
