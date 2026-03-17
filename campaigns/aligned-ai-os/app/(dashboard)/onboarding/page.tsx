"use client";

import { useState } from "react";
import { Upload, MessageSquare, ArrowRight, FileText, Check, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [path, setPath] = useState<"choose" | "upload" | "guided">("choose");
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/onboarding/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setUploadComplete(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (uploadComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-3">
          Alignment Blueprints Created
        </h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Your worksheets have been synthesized into APOS. Your coach
          now knows your values, goals, revenue targets, and everything you shared.
        </p>
        <div className="flex gap-3">
          <a
            href="/blueprint"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Blueprint
          </a>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Start Coaching
          </a>
        </div>
      </div>
    );
  }

  if (path === "choose") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-serif font-bold">
              Build Your APOS Coach
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The more your coach knows about you, the better it can serve you.
              Choose how you&apos;d like to get started.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setPath("upload")}
              className="text-left rounded-2xl border-2 border-border hover:border-primary p-6 space-y-3 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Upload Worksheets</h3>
              <p className="text-sm text-muted-foreground">
                Completed the Strategic Alignment Intensive? Upload your
                Google Doc for the richest coaching experience.
              </p>
              <div className="flex items-center gap-1 text-sm text-accent">
                Recommended for Intensive attendees
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setPath("guided")}
              className="text-left rounded-2xl border-2 border-border hover:border-primary p-6 space-y-3 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Guided Questions</h3>
              <p className="text-sm text-muted-foreground">
                New here? Your AI coach will ask you key questions to build your
                Alignment Blueprints. Takes about 10-15 minutes.
              </p>
              <div className="flex items-center gap-1 text-sm text-accent">
                Great for new users
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (path === "upload") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-lg w-full space-y-6 text-center">
          <h2 className="text-2xl font-serif font-bold">
            Upload Your Worksheets
          </h2>
          <p className="text-muted-foreground">
            Upload your completed Strategic Clarity worksheets from the Intensive
            (Google Doc exported as .docx, or .txt/.md). APOS will synthesize everything into
            your Alignment Blueprints.
          </p>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Synthesizing your Alignment Blueprints... this may take a minute
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  .docx, .txt, or .md
                </span>
              </div>
            )}
            <input
              type="file"
              accept=".docx,.txt,.md"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setPath("choose")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to options
          </button>
        </div>
      </div>
    );
  }

  // Guided path — redirect to guided chat
  if (path === "guided") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-lg w-full space-y-6 text-center">
          <h2 className="text-2xl font-serif font-bold">
            Let&apos;s Build Your Alignment Blueprints
          </h2>
          <p className="text-muted-foreground">
            APOS will ask you a series of questions to understand your
            values, goals, and business. This takes about 10-15 minutes and
            creates your Alignment Blueprints.
          </p>
          <a
            href="/chat?mode=onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Guided Onboarding
            <ArrowRight className="h-4 w-4" />
          </a>
          <div>
            <button
              onClick={() => setPath("choose")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to options
            </button>
          </div>
        </div>
      </div>
    );
  }
}
