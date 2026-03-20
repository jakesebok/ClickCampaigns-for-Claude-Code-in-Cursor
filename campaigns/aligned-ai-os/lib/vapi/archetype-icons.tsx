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
  "The Rising Architect": "#4A7C9B",
  "The Phoenix": "#D4A017",
  "The Engine": "#C0392B",
  "The Drifter": "#B8A88A",
  "The Performer": "#E87A20",
  "The Ghost": "#8A9BAE",
  "The Guardian": "#2A9D8F",
  "The Seeker": "#7B5EA7",
};

function RisingArchitectIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="The Rising Architect icon"
      {...props}
    >
      <title>The Rising Architect</title>
      <path d="M20 43.5C14.2 37.8 14.2 28.6 20 22.9C25.8 17.2 35.2 17.2 41 22.9" />
      <path d="M17 24C22.7 18.2 31.9 18.2 37.6 24C43.4 29.8 43.4 39.1 37.6 44.8" />
      <path d="M43.5 21C49.2 26.8 49.2 36.1 43.5 41.9C37.7 47.6 28.4 47.6 22.6 41.9" />
      <path strokeDasharray="4 3" d="M46.5 40.5C40.7 46.2 31.4 46.2 25.6 40.5C19.9 34.8 19.9 25.5 25.6 19.8" />
      <circle cx="32" cy="32" r="3.5" />
    </svg>
  );
}

const ARCHETYPE_ICONS: Record<VapiArchetype, LucideIcon> = {
  "The Architect": DraftingCompass,
  "The Rising Architect": RisingArchitectIcon as LucideIcon,
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
