"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
} from "@clerk/nextjs";
import { Settings } from "lucide-react";

const DASHBOARD_PATHS = ["/dashboard", "/chat", "/voice", "/assessment", "/scorecard", "/one-thing", "/blueprint", "/settings", "/priorities", "/onboarding"];

function isDashboardPath(path: string) {
  return DASHBOARD_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

export function HeaderClient() {
  const pathname = usePathname() ?? "";

  if (isDashboardPath(pathname)) {
    return null;
  }

  return (
    <header className="border-b-2 border-accent/40 bg-accent/5">
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:bg-accent/90 transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link
            href="/settings"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </Show>
      </div>
    </header>
  );
}
