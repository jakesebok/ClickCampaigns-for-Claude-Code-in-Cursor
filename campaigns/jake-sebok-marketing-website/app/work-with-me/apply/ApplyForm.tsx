"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApplyForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      business: String(formData.get("business") || "").trim(),
      revenue: String(formData.get("revenue") || "").trim(),
      why: String(formData.get("why") || "").trim(),
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        const friendly =
          data.error === "invalid_email"
            ? "Please enter a valid email address."
            : data.error === "invalid_name"
              ? "Please enter your full name."
              : data.error === "invalid_business"
                ? "Please tell me your business or role."
                : data.error === "invalid_revenue"
                  ? "Please pick a revenue range."
                  : data.error === "invalid_why"
                    ? "Please write a bit more about why now matters — at least a sentence or two."
                    : "Something went wrong submitting your application. Please try again, or email jake@alignedpower.coach directly.";
        setError(friendly);
        setSubmitting(false);
        return;
      }

      router.push("/work-with-me/apply/thank-you");
    } catch {
      setError(
        "Network error submitting your application. Please try again, or email jake@alignedpower.coach directly."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ap-primary mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={submitting}
          className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ap-primary mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={submitting}
          className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="business" className="block text-sm font-semibold text-ap-primary mb-2">
          Business / Role *
        </label>
        <input
          type="text"
          id="business"
          name="business"
          required
          disabled={submitting}
          placeholder="e.g. Chiropractor, Coach, Consultant"
          className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="revenue" className="block text-sm font-semibold text-ap-primary mb-2">
          Annual Revenue (approx.) *
        </label>
        <select
          id="revenue"
          name="revenue"
          required
          disabled={submitting}
          defaultValue=""
          className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition disabled:opacity-60"
        >
          <option value="">Select range</option>
          <option value="under-80k">Under $80K</option>
          <option value="80k-150k">$80K – $150K</option>
          <option value="150k-300k">$150K – $300K</option>
          <option value="300k-750k">$300K – $750K</option>
          <option value="750k-1m">$750K – $1M</option>
          <option value="over-1m">Over $1M</option>
        </select>
      </div>
      <div>
        <label htmlFor="why" className="block text-sm font-semibold text-ap-primary mb-2">
          Why do you want to join the Aligned Power Program? What&apos;s at stake for you? *
        </label>
        <textarea
          id="why"
          name="why"
          required
          rows={5}
          disabled={submitting}
          placeholder="Tell me your story. What is working, what is not, and what would change if your business finally fit your life?"
          className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition resize-none disabled:opacity-60"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="cta-pill w-full sm:w-auto inline-flex items-center justify-center bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
