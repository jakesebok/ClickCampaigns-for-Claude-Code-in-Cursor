export { JOURNEYMAN_DEEP_PERSONAL } from "./deep-personal.js";
export { JOURNEYMAN_DEEP_RELATIONSHIPS } from "./deep-relationships.js";
export { JOURNEYMAN_DEEP_BUSINESS } from "./deep-business.js";
export { JOURNEYMAN_PAIR_NOTES } from "./pairs.js";
export { JOURNEYMAN_ARENA_FALLBACKS } from "./fallbacks.js";

import { JOURNEYMAN_DEEP_PERSONAL } from "./deep-personal.js";
import { JOURNEYMAN_DEEP_RELATIONSHIPS } from "./deep-relationships.js";
import { JOURNEYMAN_DEEP_BUSINESS } from "./deep-business.js";

export const JOURNEYMAN_DEEP_DIVES = {
  ...JOURNEYMAN_DEEP_PERSONAL,
  ...JOURNEYMAN_DEEP_RELATIONSHIPS,
  ...JOURNEYMAN_DEEP_BUSINESS,
};
