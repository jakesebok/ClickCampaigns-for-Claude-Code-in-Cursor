import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  Target,
  ClipboardCheck,
  FileText,
  Activity,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Coach", icon: MessageSquare },
  { href: "/voice", label: "Voice", icon: Mic },
  { href: "/assessment", label: "VAPI", icon: Activity },
  { href: "/scorecard", label: "6Cs", icon: ClipboardCheck },
  { href: "/one-thing", label: "ONE THING", icon: Target },
  { href: "/blueprint", label: "Blueprint", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <Image
            src="/logo-apos.png"
            alt="APOS"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-sm text-muted-foreground">Account</span>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2 px-1 safe-area-bottom">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
