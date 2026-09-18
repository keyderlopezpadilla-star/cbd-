/**
 * Dictionary registry. Maps each locale to its dictionary. Non-ES locales are
 * stubs that fall back to the Spanish copy until they are translated.
 */
import type { Locale } from "../config";
import { en } from "./en";
import { es, type Dictionary } from "./es";
import { fr } from "./fr";
import { it } from "./it";

export const dictionaries: Record<Locale, Dictionary> = { es, en, fr, it };

export type { Dictionary };
