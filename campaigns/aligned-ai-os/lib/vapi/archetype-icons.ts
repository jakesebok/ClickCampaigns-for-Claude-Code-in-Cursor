import {
  Cog,
  DraftingCompass,
  Flame,
  Ghost,
  Search,
  Shield,
  Star,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { VapiArchetype } from "@/lib/vapi/scoring";

export const ARCHETYPE_ACCENT_COLORS: Record<VapiArchetype, string> = {
  "The Architect": "#1E3A5F",
  "The Phoenix": "#D4A017",
  "The Engine": "#C0392B",
  "The Drifter": "#B8A88A",
  "The Performer": "#E87A20",
  "The Ghost": "#8A9BAE",
  "The Guardian": "#2A9D8F",
  "The Seeker": "#7B5EA7",
};

const ARCHETYPE_ICONS: Record<VapiArchetype, LucideIcon> = {
  "The Architect": DraftingCompass,
  "The Phoenix": Flame,
  "The Engine": Cog,
  "The Drifter": Wind,
  "The Performer": Star,
  "The Ghost": Ghost,
  "The Guardian": Shield,
  "The Seeker": Search,
};

export function getArchetypeIcon(archetype: VapiArchetype): LucideIcon {
  return ARCHETYPE_ICONS[archetype];
}
