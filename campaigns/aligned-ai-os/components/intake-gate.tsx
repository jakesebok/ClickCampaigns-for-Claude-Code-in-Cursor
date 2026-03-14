"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function IntakeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/intake-context") {
      setReady(true);
      return;
    }

    let cancelled = false;
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const profile = data?.contextualProfile;
        const hasProfile =
          profile &&
          typeof profile === "object" &&
          (profile.revenueStage ||
            profile.teamSize ||
            profile.lifeStage ||
            profile.timeInBusiness ||
            profile.primaryChallenge);
        if (!hasProfile) {
          router.replace("/intake-context");
          return;
        }
        setReady(true);
      })
      .catch(() => setReady(true));

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
