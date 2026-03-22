import {
  Cog,
  DraftingCompass,
  Flame,
  Ghost,
  type LucideProps,
  Search,
  Shield,
  Star,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { VapiArchetype } from "@/lib/vapi/scoring";

export const ARCHETYPE_ACCENT_COLORS: Record<VapiArchetype, string> = {
  "The Architect": "#1E3A5F",
  "The Journeyman": "#4A7C9B",
  "The Phoenix": "#D4A017",
  "The Engine": "#C0392B",
  "The Drifter": "#B8A88A",
  "The Performer": "#E87A20",
  "The Ghost": "#8A9BAE",
  "The Guardian": "#2A9D8F",
  "The Seeker": "#7B5EA7",
};

function JourneymanIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="The Journeyman icon"
      {...props}
    >
      <title>The Journeyman</title>
      {/* Three interlocking circles (Business, Relationships, Self); one ring has a deliberate gap. */}
      <circle cx="32" cy="22" r="12" />
      <circle cx="20" cy="42" r="12" />
      <circle
        cx="44"
        cy="42"
        r="12"
        strokeDasharray="52 28"
        transform="rotate(18 44 42)"
      />
    </svg>
  );
}

const ARCHETYPE_ICONS: Record<VapiArchetype, LucideIcon> = {
  "The Architect": DraftingCompass,
  "The Journeyman": JourneymanIcon as LucideIcon,
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
