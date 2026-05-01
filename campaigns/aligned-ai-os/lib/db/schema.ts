import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userTierEnum = pgEnum("user_tier", [
  "coaching_client",
  "webinar_attendee",
  "general",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "expired",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  tier: userTierEnum("tier").notNull().default("general"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status")
    .notNull()
    .default("trialing"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  trialEndsAt: timestamp("trial_ends_at"),
  couponCode: text("coupon_code"),
  /** Daily Spark push (legacy column name `sms_enabled` — not used for SMS) */
  smsEnabled: boolean("sms_enabled").default(false),
  /** Legacy HH:mm — not used when Daily Spark runs on a single daily cron (see vercel.json). */
  smsTime: text("sms_time").default("07:00"),
  timezone: text("timezone").default("America/New_York"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  contextualProfile: jsonb("contextual_profile").$type<{
    revenueStage?: string;
    teamSize?: string;
    lifeStage?: string;
    timeInBusiness?: string;
    primaryChallenge?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contextDocuments = pgTable("context_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  masterContext: text("master_context"),
  alignmentBlueprint: text("alignment_blueprint"),
  rawWorksheets: text("raw_worksheets"),
  structuredData: jsonb("structured_data").$type<ContextStructuredData>(),
  contextDepth: integer("context_depth").default(0),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OnboardingSectionId =
  | "real_reasons"
  | "driving_fire"
  | "core_values"
  | "future_vision"
  | "business_basics";

export type OnboardingSectionStatus = "not_started" | "in_progress" | "complete";

export type OnboardingState = {
  /** 1-indexed pointer for "Section X of 5". Defaults to 1 when null/missing. */
  currentSection: number;
  /** Per-section captured summary + status. Updated as Alfred emits state markers. */
  sections: Partial<Record<OnboardingSectionId, { status: OnboardingSectionStatus; summary?: string }>>;
  /** Set true once Alfred declares all sections complete and prompts for wrap. */
  readyToWrap: boolean;
  /** Set true once user confirms wrap and Blueprints have been generated. */
  finalized: boolean;
};

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").default("New conversation"),
  /**
   * Conversation mode. NULL means default coaching chat. "onboarding" routes the
   * conversation through GUIDED_ONBOARDING_PROMPT and hides regular chat affordances
   * in the UI. Other modes can be added later (e.g. "scorecard-debrief").
   */
  mode: text("mode").$type<"onboarding" | null>(),
  /**
   * Structured onboarding state. NULL on non-onboarding conversations and on
   * onboarding conversations created before the state machine was added.
   * Updated by parsing [[STATE:...]] markers from Alfred's streamed responses.
   */
  onboardingState: jsonb("onboarding_state").$type<OnboardingState>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").notNull().$type<"user" | "assistant">(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weeklyOneThings = pgTable("weekly_one_things", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  weekStart: timestamp("week_start").notNull(),
  oneThing: text("one_thing").notNull(),
  lane: text("lane"),
  midWeekCheckIn: text("mid_week_check_in"),
  endOfWeekReflection: text("end_of_week_reflection"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scorecardEntries = pgTable("scorecard_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  weekStart: timestamp("week_start").notNull(),
  scores: jsonb("scores").$type<Record<string, number>>().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// vapi_results is managed by the portal — Aligned Freedom Coach reads/writes via REST (lib/portal-data.ts), not Drizzle

export const apiUsageLogs = pgTable("api_usage_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  endpoint: text("endpoint").notNull(), // e.g. "chat"
  model: text("model"),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  cacheReadInputTokens: integer("cache_read_input_tokens").default(0),
  cacheCreationInputTokens: integer("cache_creation_input_tokens").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Web push subscriptions (6Cs weekend reminders + Daily Spark when enabled) */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    endpoint: text("endpoint").notNull().unique(),
    keys: jsonb("keys").$type<{ p256dh: string; auth: string }>().notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const onboardingProgress = pgTable("onboarding_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  currentStep: integer("current_step").default(0),
  responses: jsonb("responses").$type<Record<string, string>>().default({}),
  path: text("path").notNull().$type<"upload" | "guided">(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContextStructuredData = {
  values?: { name: string; definition: string; behaviors: string; boundary: string }[];
  miqs?: { experiences: string; growth: string; contribution: string };
  why?: string;
  justCause?: string;
  missionStatement?: string;
  futureFour?: {
    self: { words: string[]; standards: string };
    social: { people: string; identity: string; weeklyBehavior: string };
    skills: { pfi: string; leveragedSkill: string; practice: string };
    service: { contribution: string; bridge: string };
  };
  realityCheck?: {
    mustBeTrue: string;
    misalignments: string;
    costs: string;
    nextRightMove: string;
    resistance: string;
    support: string;
  };
  revenue?: {
    requiredAnnual: number;
    targetRevenue: number;
    asv: number;
    closeRate: number;
    qcsPerWeek: number;
    leadLane: string;
  };
  oneThing?: {
    leadLane: string;
    oneThing: string;
    timeBlock: string;
    frequency: string;
  };
};
