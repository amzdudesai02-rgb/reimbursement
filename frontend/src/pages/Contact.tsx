import { useState } from "react";
import type { AxiosError } from "axios";
import { api } from "../lib/api";

const cards = [
  {
    title: "Talk to sales",
    description: "Book a 1:1 audit walkthrough and see forecasted recoveries.",
    value: "sales@amzdudes.io",
    action: "Book a call",
    href: "mailto:sales@amzdudes.io",
  },
  {
    title: "Support desk",
    description: "24/7 live chat + 2h SLA for critical reimbursement cases.",
    value: "support@amzdudes.io",
    action: "Open help center",
    href: "mailto:support@amzdudes.io",
  },
  {
    title: "WhatsApp hotline",
    description: "Direct escalation channel for API outages and case appeals.",
    value: "+1 (415) 231-8820",
    action: "Message now",
    href: "https://wa.me/14152318820",
  },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSending(true);
    try {
      await api.post("/contact", { name, email, message });
      setSent(true);
    } catch (error) {
      const axiosErr = error as AxiosError<{ detail?: string }>;
      setErr(axiosErr.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 p-8 text-white shadow-[0_25px_60px_rgba(79,70,229,0.4)]">
        <p className="text-xs uppercase tracking-[0.3em] text-white/80">
          We’re here 24/7
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Let’s recover together</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90">
          Whether you need onboarding help, have an API escalation, or want to
          review your reimbursement forecast, our team is on Slack, WhatsApp,
          and email. Drop us a note and we’ll respond within one business hour.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.07)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {card.title}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">
              {card.value}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{card.description}</p>
            <a
              href={card.href}
              className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {card.action}
              <span className="ml-2 text-lg">↗</span>
            </a>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Send a message
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Tell us about your case
          </h2>
          <p className="mb-6 mt-2 text-sm text-slate-500">
            We respond in under 60 minutes. Include your Amazon case ID or
            marketplace if applicable.
          </p>
          {sent ? (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              🎉 Thanks! We’ll get back to you shortly.
            </div>
          ) : (
            <>
              {err && (
                <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
                  {err}
                </div>
              )}
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-600">
                  Full Name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Azlan Khan"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Work Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ops@brand.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  How can we help?
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share context, case IDs, marketplaces…"
                    className="mt-2 h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>
              <button
                disabled={sending}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </>
          )}
        </form>

        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Need immediate help?
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Priority case escalation
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Use this playbook if Amazon revoked API scopes, rejected a
            reimbursement, or if you need the fraud team looped in.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              ① Drop your case context in #reimbursement-alerts Slack channel.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              ② Include case ID, marketplace, and settlement report.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              ③ Our specialists will create a manual appeal or escalate to
              Amazon CAT within 30 minutes.
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-900">Office Hours</p>
            <p>Mon–Fri, 8 AM – 10 PM PST</p>
            <p>Weekend coverage for priority plans</p>
          </div>
        </div>
      </section>
    </div>
  );
}