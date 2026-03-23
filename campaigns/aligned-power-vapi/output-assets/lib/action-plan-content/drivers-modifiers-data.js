/**
 * Driver modifiers: 11 slugs × 12 domain codes (PH–EC). Merged from parts for maintainability.
 */
import { MOD_A } from "./drivers-modifiers-a.js";
import { MOD_B } from "./drivers-modifiers-b.js";
import { MOD_C } from "./drivers-modifiers-c.js";

/** @type {Record<string, Record<string, string>>} */
export const DRIVER_MODIFIERS = {
  ...MOD_A,
  ...MOD_B,
  ...MOD_C,
};
