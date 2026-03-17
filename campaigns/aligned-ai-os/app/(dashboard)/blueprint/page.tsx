"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Target,
  Compass,
  Users,
  Wrench,
  HandHeart,
  DollarSign,
  AlertCircle,
  Upload,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type BlueprintData = {
  alignmentBlueprint: string | null;
  contextDepth: number;
  version: number;
  updatedAt: string;
};

export default function BlueprintPage() {
  const [data, setData] = useState<BlueprintData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/context")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading your blueprint...</div>
      </div>
    );
  }

  if (!data?.alignmentBlueprint) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-semibold mb-3">
          Your Blueprint Awaits
        </h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Complete your onboarding — upload your Strategic Clarity worksheets or
          answer the guided questions — and your personalized Alignment Blueprint
          will appear here.
        </p>
        <a
          href="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Onboarding
        </a>
      </div>
    );
  }

  const sections = [
    { icon: Target, label: "North Star Stack", id: "north-star" },
    { icon: Heart, label: "Core Values", id: "values" },
    { icon: Compass, label: "The Future You", id: "future-you" },
    { icon: DollarSign, label: "Revenue + Operations", id: "revenue" },
    { icon: Target, label: "Vital Action (90 Days)", id: "domino" },
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Alignment Blueprint</h1>
            <p className="text-sm text-muted-foreground">
              Version {data.version} — Updated{" "}
              {new Date(data.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Context Depth</div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${data.contextDepth}%` }}
              />
            </div>
            <span className="text-xs font-medium">{data.contextDepth}%</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{data.alignmentBlueprint}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
