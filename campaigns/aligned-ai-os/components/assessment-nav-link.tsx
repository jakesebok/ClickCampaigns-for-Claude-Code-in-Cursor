"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

type Props = {
  label: string;
  className?: string;
  /** When user has results, use this label instead (optional) */
  labelWhenHasResults?: string;
};

export function AssessmentNavLink({
  label,
  className = "",
  labelWhenHasResults,
}: Props) {
  const [hasResults, setHasResults] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/vapi", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setHasResults((data.results?.length ?? 0) > 0))
      .catch(() => setHasResults(false));
  }, []);

  const href = hasResults ? "/assessment/results" : "/assessment";
  const displayLabel = hasResults && labelWhenHasResults ? labelWhenHasResults : label;

  return (
    <Link href={href} className={className}>
      <Activity className="h-4 w-4" />
      {displayLabel}
    </Link>
  );
}
