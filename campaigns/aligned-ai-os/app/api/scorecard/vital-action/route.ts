import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import {
  fetchPortalSixCByEmail,
  insertPortalSixC,
  updatePortalSixC,
} from "@/lib/portal-data";
import {
  getMostRecentScorecardWindow,
  getScorecardWindow,
  isDateInScorecardWindow,
  isSameEasternCalendarWeek,
} from "@/lib/scorecard-window";
import { hasMeaningfulScores } from "@/lib/scorecard-entry-state";
import { getWeekStart } from "@/lib/utils";

function normalizeOneThing(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const oneThing = normalizeOneThing(body?.oneThing);
  if (!oneThing) {
    return NextResponse.json(
      { error: "A Vital Action is required." },
      { status: 400 }
    );
  }

  const window = getScorecardWindow();
  if (window.canSubmit) {
    return NextResponse.json(
      {
        error: "Manual Vital Action is only available after the scorecard window closes.",
      },
      { status: 400 }
    );
  }

  const rows = await fetchPortalSixCByEmail(user.email);
  const scoredRows = rows.filter((row) => hasMeaningfulScores(row.scores));
  if (!scoredRows.length) {
    return NextResponse.json(
      {
        error: "Manual Vital Action requires at least one prior scored 6Cs submission.",
      },
      { status: 400 }
    );
  }

  const relevantWindow = getMostRecentScorecardWindow(window);
  const submittedInMostRecentWindow = scoredRows.some((row) =>
    isDateInScorecardWindow(row.created_at, relevantWindow)
  );
  const latestScored = scoredRows[0] || null;
  const showFirstSubmissionFallback =
    scoredRows.length === 1 &&
    !!latestScored &&
    !submittedInMostRecentWindow &&
    isSameEasternCalendarWeek(latestScored.created_at, new Date());
  const missedWindow = !submittedInMostRecentWindow && !showFirstSubmissionFallback;

  if (!missedWindow) {
    return NextResponse.json(
      {
        error: "Manual Vital Action is only available after missing the most recent scorecard window.",
      },
      { status: 400 }
    );
  }

  const relevantCloseTs = relevantWindow.closesAt.getTime();
  const nextOpenTs = window.nextOpen.getTime();
  const existingManualRow =
    rows.find((row) => {
      const createdAt = new Date(row.created_at).getTime();
      return (
        createdAt > relevantCloseTs &&
        createdAt < nextOpenTs &&
        !hasMeaningfulScores(row.scores) &&
        !!normalizeOneThing(row.one_thing_to_improve)
      );
    }) || null;

  const savedRow = existingManualRow
    ? await updatePortalSixC(existingManualRow.id, {
        scores: {},
        oneThing,
        weeklyReview: null,
      })
    : await insertPortalSixC({
        email: user.email,
        scores: {},
        oneThing,
      });

  if (!savedRow) {
    return NextResponse.json(
      { error: "Failed to save Vital Action." },
      { status: 500 }
    );
  }

  const weekStart = getWeekStart(new Date(savedRow.created_at));
  return NextResponse.json({
    ok: true,
    entry: {
      id: savedRow.id,
      createdAt: savedRow.created_at,
      weekStart: weekStart.toISOString(),
      scores: savedRow.scores || {},
      notes: JSON.stringify({
        reflections: {},
        oneThing: savedRow.one_thing_to_improve || "",
      }),
    },
  });
}
