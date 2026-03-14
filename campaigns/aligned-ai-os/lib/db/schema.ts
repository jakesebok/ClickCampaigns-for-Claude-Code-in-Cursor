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
  smsEnabled: boolean("sms_enabled").default(false),
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

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").default("New conversation"),
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

// vapi_results is managed by the portal — APOS reads/writes via REST (lib/portal-data.ts), not Drizzle

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
