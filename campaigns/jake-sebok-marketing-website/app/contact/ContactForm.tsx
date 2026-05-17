"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContactForm() {
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
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
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
              ? "Please enter your name."
              : data.error === "invalid_message"
                ? "Please write a message."
                : "Something went wrong sending your message. Please try again, or email jake@alignedpower.coach directly.";
        setError(friendly);
        setSubmitting(false);
        return;
      }

      router.push("/contact/thank-you");
    } catch {
      setError(
        "Network error sending your message. Please try again, or email jake@alignedpower.coach directly."
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      id="contact-form"
      data-lc-source="contact_form"
      onSubmit={onSubmit}
      className="space-y-6"
      noValidate
    >
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ap-primary mb-2">
          Name *
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
        <label htmlFor="message" className="block text-sm font-semibold text-ap-primary mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={submitting}
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

      <button
        type="submit"
        disabled={submitting}
        className="cta-pill inline-flex items-center justify-center bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
