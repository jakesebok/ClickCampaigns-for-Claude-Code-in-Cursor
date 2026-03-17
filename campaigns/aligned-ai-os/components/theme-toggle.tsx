"use client";

import { Moon, Sun } from "lucide-react";

function setThemeCookie(theme: string) {
  try {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    if (/alignedpower\.coach$/.test(host)) {
      document.cookie = `ap-theme=${theme}; path=/; max-age=31536000; domain=.alignedpower.coach`;
    } else if (/vap\.coach$/.test(host)) {
      document.cookie = `ap-theme=${theme}; path=/; max-age=31536000; domain=.vap.coach`;
    }
  } catch {}
}

export function ThemeToggle() {
  function toggle() {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    html.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("ap-theme", next);
      setThemeCookie(next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
