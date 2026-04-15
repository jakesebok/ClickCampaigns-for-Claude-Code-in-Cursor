/**
 * Client intake payload for "Build Your Assessment" (versioned JSON in Supabase).
 */

export type BuildIntakePayloadV1 = {
  version: 1;
  hasProprietarySystem: boolean | null;
  proprietarySystemDescription: string;
  proprietaryGapNotes: string;

  businessGoals: string[];
  audienceAndContext: string;
  jobToBeDoneNotes: string;

  constructTree: {
    /**
     * grouped: parent arenas each contain domains (e.g. VAPI™-style buckets).
     * flat: constructs only—no shared parent (e.g. twelve equal pillars).
     */
    structure: "grouped" | "flat";
    arenas: Array<{
      id: string;
      name: string;
      domains: Array<{ id: string; name: string }>;
    }>;
    /** Used when structure is "flat" (domains without arenas). */
    standaloneDomains: Array<{ id: string; name: string }>;
  };

  lengthPreference: "short" | "balanced" | "comprehensive" | "";
  scalePreference: "sevenLikert" | "fiveLikert" | "binary" | "mixed" | "";
  optionalSections: string[];

  scoringPipelineNotes: string;
  bandsTiersDiscussKickoff: boolean;
  wantsPriorityMatrix: boolean;
  wantsPatternLayer: boolean;
  patternLayerNotes: string;

  resultsOutputs: string[];

  readingLevelIndex: number;
  contentDepth: string;
  whoAuthors: string;
  librariesNotes: string;

  wantsGeneratedPlans: boolean;
  planCadenceNotes: string;
  planUpdateNotes: string;

  /** Whether they already use an auth vendor (Clerk, Auth0, Cognito, etc.) */
  hasAuthProvider: "" | "yes" | "no";
  /** Named when hasAuthProvider is "yes" */
  authProviderName: string;

  coachDashboardExtras: string;

  interestedInLongitudinal: boolean;
  longitudinalNotes: string;

  brandWebsiteUrl: string;
  brandLogoUrl: string;
  /** Google Drive (or similar) link to logo / brand assets */
  brandLogoDriveUrl: string;
  brandColorPrimaryHex: string;
  brandColorSecondaryHex: string;
  brandColorAccentHex: string;
  brandColorsNotes: string;
  brandHeadlineFont: string;
  brandBodyFont: string;
  brandAccentFont: string;
  brandTypographyNotes: string;
  brandTheme: "light" | "dark" | "both" | "";

  /** Optional; collected later if missing */
  privacyPolicyUrl: string;
  termsUrl: string;

  crm: string;
  analytics: string;
  otherIntegrations: string;
  lms: string;

  rushSoonerThan30Days: boolean;
  rushContextNotes: string;

  contactName: string;
  contactEmail: string;
};

export const DEFAULT_BUILD_INTAKE: BuildIntakePayloadV1 = {
  version: 1,
  hasProprietarySystem: null,
  proprietarySystemDescription: "",
  proprietaryGapNotes: "",

  businessGoals: [],
  audienceAndContext: "",
  jobToBeDoneNotes: "",

  constructTree: {
    structure: "grouped",
    arenas: [],
    standaloneDomains: [],
  },

  lengthPreference: "",
  scalePreference: "",
  optionalSections: [],

  scoringPipelineNotes: "",
  bandsTiersDiscussKickoff: true,
  wantsPriorityMatrix: false,
  wantsPatternLayer: false,
  patternLayerNotes: "",

  resultsOutputs: [],

  readingLevelIndex: 2,
  contentDepth: "",
  whoAuthors: "",
  librariesNotes: "",

  wantsGeneratedPlans: false,
  planCadenceNotes: "",
  planUpdateNotes: "",

  hasAuthProvider: "",
  authProviderName: "",

  coachDashboardExtras: "",

  interestedInLongitudinal: false,
  longitudinalNotes: "",

  brandWebsiteUrl: "",
  brandLogoUrl: "",
  brandLogoDriveUrl: "",
  brandColorPrimaryHex: "",
  brandColorSecondaryHex: "",
  brandColorAccentHex: "",
  brandColorsNotes: "",
  brandHeadlineFont: "",
  brandBodyFont: "",
  brandAccentFont: "",
  brandTypographyNotes: "",
  brandTheme: "",

  privacyPolicyUrl: "",
  termsUrl: "",

  crm: "",
  analytics: "",
  otherIntegrations: "",
  lms: "",

  rushSoonerThan30Days: false,
  rushContextNotes: "",

  contactName: "",
  contactEmail: "",
};
