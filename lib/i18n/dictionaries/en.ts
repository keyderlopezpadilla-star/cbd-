/**
 * English dictionary (stub).
 *
 * EN is not fully translated yet. It re-exports the Spanish dictionary as the
 * fallback so the UI stays complete. Override individual keys here as they are
 * translated - the `Dictionary` type keeps the shape in sync with `es`.
 */
import { es, type Dictionary } from "./es";

export const en: Dictionary = es;

export default en;
