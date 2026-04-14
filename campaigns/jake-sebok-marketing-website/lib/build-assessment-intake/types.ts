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
    arenas: Array<{
      id: string;
      name: string;
      domains: Array<{ id: string; name: string }>;
    }>;
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

  authPreference: "supabase" | "clerk" | "unsure" | "";
  coachDashboardExtras: string;

  interestedInLongitudinal: boolean;
  longitudinalNotes: string;

  brandLogoUrl: string;
  brandColorsNotes: string;
  brandTypographyNotes: string;
  brandTheme: "light" | "dark" | "both" | "";

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

  constructTree: { arenas: [] },

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

  authPreference: "",
  coachDashboardExtras: "",

  interestedInLongitudinal: false,
  longitudinalNotes: "",

  brandLogoUrl: "",
  brandColorsNotes: "",
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
